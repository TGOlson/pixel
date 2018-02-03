// TODO: some of these could be fetch from the server

export const TOTAL_PIXELS = 1000 * 1000; // 1M

// Pixel display dimensions
// should always be be sqrt(TOTAL_PIXELS)
export const DIMENSION = 1000;

// https://material.io/color
// $$('.palette-container').map(c => c.children[c.children.length - 1]).slice(0, 19)
// $$('.palette-container').slice(0, 19)
//   .map(el =>
//     el.children[el.children.length - 1]
//       .style['background-color']
//       .match(/\d+/g)
//       .map(x => {
//         const y = parseInt(x, 10).toString(16);
//         return y.length === 1 ? `0${y}` : y
//       })
//       .join('') + 'ff');


// Note: the first color will be the default used for all unset pixels
export const PIXEL_COLORS_HEX = [
  '#c5c8c6ff',
  '#d50000ff',
  // '#c51162ff',
  '#aa00ffff',
  '#6200eaff',
  // '#304ffeff', // indigo
  '#2962ffff',
  '#0091eaff',
  // '#00b8d4ff', // cyan
  '#00bfa5ff',
  '#00c853ff',
  '#64dd17ff',
  '#aeea00ff',
  '#ffd600ff',
  '#ffab00ff',
  '#ff6d00ff',
  '#dd2c00ff',
  '#3e2723ff',
  '#212121ff',
  // '#263238ff',
];

// Note: this is used so that we can create an 8bit view on top of our 32bit array
export const PIXEL_COLORS_HEX_BYTES_REVERSED = PIXEL_COLORS_HEX.map((hex) => {
  const [a, b, c, d, e, f, g, h] = hex.slice(1);
  const reversed = `${g}${h}${e}${f}${c}${d}${a}${b}`;
  return parseInt(reversed, 16);
});
