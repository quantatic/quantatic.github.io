import path from 'path';
import WasmPackPlugin from '@wasm-tool/wasm-pack-plugin';
import {Configuration} from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';

const dist = path.resolve(__dirname, 'dist');


const config: Configuration = {
  mode: 'production',
  entry: {
    gb: './js/gb.ts',
    gba: './js/gba.ts',
  },
  target: 'web',
  output: {
    path: dist,
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.css', '.js'],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'static', 'index.html'),
      inject: false,
      filename: 'index.html',
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'static', 'gb.html'),
      chunks: ['gb'],
      filename: 'gb.html',
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'static', 'gba.html'),
      chunks: ['gba'],
      filename: 'gba.html',
    }),
    new WasmPackPlugin({
      crateDirectory: __dirname,
    }),
  ],
  experiments: {
    asyncWebAssembly: true,
    topLevelAwait: true,
  },
  performance: {
    hints: false,
  },
};

export default config;
