import Image, { BorderHandling, ConvolutionAlgorithm } from "image-js";
import { ImageFile } from "../types";

export const appendPreview = (file: ImageFile | File) => {
  let oldUrl = null;

  if ((file as ImageFile).preview) {
    oldUrl;
  }

  Object.assign(file, { preview: URL.createObjectURL(file) });

  if (oldUrl) {
    URL.revokeObjectURL(oldUrl);
  }
};

export const convertToThemeColor = (
  imgPixels: Image,
  intensity = 150,
  color = [18, 31, 68],
  color1 = [255, 255, 255]
) => {
  const data = imgPixels.data;

  for (let i = 0; i < data.length; i += 4) {
    let r = data[i],
      g = data[i + 1],
      b = data[i + 2],
      a = data[i + 3];

    if (b <= intensity) {
      // set the primary color
      data[i] = color[0];
      data[i + 1] = color[1];
      data[i + 2] = color[2];
    } else {
      data[i] = color1[0];
      data[i + 1] = color1[1];
      data[i + 2] = color1[2];
    }
  }
};

export const grayscale = async (src: ImageFile) => {
  if (!src.preview) {
    throw Error("[grayscale] Preview is missing");
  }

  let img = await Image.load(src.preview);
  img = (img as Image).grey();

  return new File([await img.toBlob()], src.name, { type: src.type });
};

export const posterize = async (
  src: ImageFile,
  intensity: number,
  color1 = "#000000",
  color2 = "#ffffff"
) => {
  if (!src.preview) {
    throw Error("[posterize] Preview is missing");
  }

  try {
    const image = await Image.load(src.preview);

    const color1ToRgb = hexToRgb(color1);
    const color1Array = [color1ToRgb.r, color1ToRgb.g, color1ToRgb.b];

    const color2ToRgb = hexToRgb(color2);
    const color2Array = [color2ToRgb.r, color2ToRgb.g, color2ToRgb.b];

    convertToThemeColor(image, intensity, color1Array, color2Array);

    const blob = await image
      .resize({ height: 400, width: 500, preserveAspectRatio: true })
      .gaussianFilter({
        radius: 0,
      })
      .toBlob();
    const newImg = new File([blob], src.name, { type: src.type });

    appendPreview(newImg);
    return newImg;
  } catch (error) {
    console.log(error);
  }
};

export const cropImage = async (src: string) => {
  let img = await Image.load(src);

  let img1 = img.crop({ height: 300, y: 80 });
  let img2 = img.crop({ height: 160, y: 207 });

  return [img1.toDataURL(), img2.toDataURL()];
};

export function hexToRgb(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}
