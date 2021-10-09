import { useRef, useEffect, useCallback } from "react";

export function useWorker({ onMessage }) {
  const workerRef = useRef();

  useEffect(() => {
    workerRef.current = new Worker(new URL("../../worker.ts", import.meta.url));
    workerRef.current.onmessage = (evt) => {
      console.log("🚀 ~ file: useWorker.ts ~ line 8 ~ useEffect ~ evt", evt);

      onMessage(evt);
    };

    return () => {
      workerRef.current.terminate();
    };
  }, [onMessage]);

  const handleWork = useCallback(async () => {
    workerRef.current.postMessage(100000);
  }, []);

  const postMessage = useCallback((...args) => {
    console.log("--", args);
    workerRef.current.postMessage(...args);
  }, []);

  return { handleWork, postMessage };
}
