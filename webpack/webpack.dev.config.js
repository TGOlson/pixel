const webpack = require('webpack'); // eslint-disable-line no-unused-vars
const path = require('path');

const parentDir = path.join(__dirname, '../');

module.exports = {
  entry: [
    path.join(parentDir, 'src/index.js'),
  ],
  module: {
    loaders: [{
      test: /\.(js|jsx)$/,
      exclude: /node_modules/,
      loader: 'babel-loader',
    }, {
      test: /\.less$/,
      loaders: ['style-loader', 'css-loader', 'less-loader'],
    }],
  },
  output: {
    path: `${parentDir}/dist}`,
    filename: 'bundle.js',
  },
  devServer: {
    contentBase: parentDir,
    historyApiFallback: true,
  },
};
