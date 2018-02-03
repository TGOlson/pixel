// TODO: some of these could be fetch from the server

export const TOTAL_PIXELS = 1000 * 1000; // 1M

// Pixel display dimensions
// should always be be sqrt(TOTAL_PIXELS)
export const DIMENSION = 1000;

// https://terminal.sexy is a good place to generate these
// Note: the first color will be the default used for all unset pixels
export const PIXEL_COLORS_HEX = [
  0xc5c8c6ff,
  0x282a2eff,
  0xa54242ff,
  0x8c9440ff,
  0xde935fff,
  0x5f819dff,
  0x85678fff,
  0x5e8d87ff,
  0x707880ff,
  0x373b41ff,
  0xcc6666ff,
  0xb5bd68ff,
  0xf0c674ff,
  0x81a2beff,
  0xb294bbff,
  0x8abeb7ff,
];

// Note: this is used so that we can create an 8bit view on top of our 32bit array
export const PIXEL_COLORS_HEX_REVERSED = PIXEL_COLORS_HEX.map((hex) => {
  const [a, b, c, d, e, f, g, h] = hex.toString(16).split('');
  const reversed = `${g}${h}${e}${f}${c}${d}${a}${b}`;
  return parseInt(reversed, 16);
});
