/* eslint-disable @next/next/no-img-element */
import styles from "../styles/Home.module.css";
import { useEffect, useState } from "react";
import { appendPreview, posterize } from "../src/utils/image";
import { ImageFile } from "../src/types";
import { ColorInput, Upload } from "../components/elements";
import {
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Box,
  Flex,
} from "@chakra-ui/react";
import { useDebounce } from "react-recipes";

function useInput(initialState) {
  const [val, setVal] = useState(initialState);

  const handleChange = (e) => {
    setVal(e.target.value);
  };

  return [val, handleChange];
}

const DEBOUNCE_TIME = 450;
export default function Home() {
  const [img, setImg] = useState<ImageFile>();
  const [ogImg, setogImg] = useState<File>();

  const [color1, onColor1Change] = useInput("#000000");
  const [color2, onColor2Change] = useInput("#ffffff");
  const [intensity, onIntensityChange] = useState(150);

  const debColor1 = useDebounce(color1, DEBOUNCE_TIME);
  const debColor2 = useDebounce(color2, DEBOUNCE_TIME);
  const debIntensity = useDebounce(intensity, DEBOUNCE_TIME);

  const handleImageChange = async (e) => {
    let file: File = e.target.files[0];
    appendPreview(file);

    setogImg(file);

    file = await posterize(file, 150);

    setImg(file);
  };

  useEffect(() => {
    if (!ogImg) {
      return;
    }

    const handleColorChanges = async () => {
      const file = await posterize(ogImg, debIntensity, debColor1, debColor2);
      setImg(file);
    };

    handleColorChanges();
  }, [debColor1, debColor2, debIntensity, ogImg]);

  return (
    <Flex
      bg="#fffcf5"
      flexDir="column"
      justifyContent="center"
      alignItems="center"
    >
      <Flex
        maxW={1200}
        flexDir="column"
        justifyContent="center"
        alignItems="center"
        minH="100vh"
      >
        <div className={styles.img_wrapper}>
          {img?.preview ? (
            <img className={styles.img} src={img?.preview} alt="user" />
          ) : (
            <div>
              {" "}
              <h2>Upload an Image to start</h2>{" "}
            </div>
          )}
        </div>
        <Upload type="file" name="img" onChange={handleImageChange} />
        <Flex flexDir="column" w={"full"}>
          <Flex w={"full"}>
            <ColorInput
              type="color"
              name="color1"
              value={color1}
              onChange={onColor1Change}
            />
            <ColorInput
              type="color"
              name="color2"
              value={color2}
              onChange={onColor2Change}
            />
          </Flex>

          <Box w={"full"}>
            <Box w="full">
              <Slider
                my="4"
                aria-label="slider-intensity"
                name="intensity"
                max={255}
                value={intensity}
                onChange={onIntensityChange}
              >
                <SliderTrack>
                  <SliderFilledTrack bg="tomato" />
                </SliderTrack>
                <SliderThumb></SliderThumb>
              </Slider>
            </Box>
          </Box>
        </Flex>
      </Flex>
    </Flex>
  );
}
