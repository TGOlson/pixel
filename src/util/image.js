import { PIXEL_COLORS_RGBA } from './constants';

export const pixelToRGBA = (pixel) => {
  const rgba = PIXEL_COLORS_RGBA[pixel];

  if (!rgba) throw new Error(`Unknown 4bit pixel number '${pixel}'`);

  return rgba;
};

export const getImageData = (pixels, width, height) => {
  const data = new Uint8ClampedArray(width * height * 4);

  pixels.forEach((pixel, index) => {
    const [r, g, b, a] = pixelToRGBA(pixel);
    const x = index * 4;

    data[x + 0] = r;
    data[x + 1] = g;
    data[x + 2] = b;
    data[x + 3] = a;
  });

  return new ImageData(data, width); // eslint-disable-line no-undef
};
