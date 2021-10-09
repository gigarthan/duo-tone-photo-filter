import { posterize } from "./src/utils/image";

export {};

addEventListener("message", (event) => {
  console.log(
    "🚀 ~ file: worker.ts ~ line 6 ~ addEventListener ~ event",
    event
  );

  const fileBlob = event.data;

  posterize(fileBlob, 150).then((f) => postMessage(f));
});
