// TODO: some of these could be fetch from the server

export const TOTAL_PIXELS = 1000 * 1000; // 1M

// Pixel display dimensions
// should always be be sqrt(TOTAL_PIXELS)
export const DIMENSION = 1000;

// https://terminal.sexy is a good place to generate these
// Note: the first color will be the default used for all unset pixels
export const PIXEL_COLORS_HEX = [
  '#c5c8c6',
  '#282a2e',
  '#a54242',
  '#8c9440',
  '#de935f',
  '#5f819d',
  '#85678f',
  '#5e8d87',
  '#707880',
  '#373b41',
  '#cc6666',
  '#b5bd68',
  '#f0c674',
  '#81a2be',
  '#b294bb',
  '#8abeb7',
];

export const PIXEL_COLORS_RGBA = PIXEL_COLORS_HEX.map((hex) => {
  const [a, b, c, d, e, f] = hex.slice(1, hex.length);

  return [
    parseInt(a + b, 16),
    parseInt(c + d, 16),
    parseInt(e + f, 16),
    255,
  ];
});
