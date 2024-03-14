const path = require('path');

const CopyPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: {
    bundle: path.resolve(__dirname, 'src/index.ts'),
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      }
    ],
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, "assets"),
          to: 'assets'
        },
        {
          from: path.resolve(__dirname, "public"),
          to: ''
        }
      ]
    }),
    new HtmlWebpackPlugin({
      title: "Bug Tap!",
      filename: 'index.html',
      template: path.resolve(__dirname, 'public/template.html')
    }),
  ],
};
