import { styled } from "@stitches/react";

export const Upload = styled("input", {
  visibility: "hidden",
  width: "100%",
  "&::before": {
    visibility: "visible",
    content: "Select Image",
    display: "block",
    backgroundColor: "#ff5d01",
    padding: "1rem",
    color: "#fff",
    width: "100%",
    textAlign: "center",
  },
});

export const ColorInput = styled("input", {
  background: "none",
  border: "none",
  width: "100%",
});
