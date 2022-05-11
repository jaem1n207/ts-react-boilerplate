// 이를 먼저 실행하여 올바른 환경을 인식할 수 있도록 합니다.
process.env.BABEL_ENV = 'development';
process.env.ASSET_PATH = '/';

const webpack = require('webpack');
const { merge } = require('webpack-merge');
const path = require('path');
const LoadablePlugin = require('@loadable/webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const HtmlWebpackPlugin = require('html-webpack-plugin');
const env = require('../utils/env');
const baseConfig = require('../webpack.base.js');
const ROOT_DIR = path.resolve(__dirname, '../');
const resolvePath = (...args) => path.resolve(ROOT_DIR, ...args);
const BUILD_DIR = resolvePath('dist');

const clientConfig = {
  target: 'web',
  entry: {
    client: ['webpack-hot-middleware/client?reload=true&noInfo=true', './src/index.tsx'],
  },
  devtool: 'inline-cheap-module-source-map',
  devServer: {
    contentBase: './src',
    compress: true,
    historyApiFallback: true,
    host: 'localhost',
    port: env.PORT,
    hot: true,
    open: true,
  },
  output: {
    path: resolvePath(BUILD_DIR, 'dist'),
    publicPath: env.ASSET_PATH,
    filename: '[name].js',
    chunkFilename: '[name].js',
    devtoolModuleFilenameTemplate: (info) => path.resolve(info.absoluteResourcePath).replace(/\\/g, '/'),
    assetModuleFilename: 'assets/[hash][ext][query]',
  },
  resolve: {
    ...baseConfig.resolve,
  },
  module: {
    ...baseConfig.module,
    rules: [
      {
        test: /\.(css|less|styl|scss|sass|sss)$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    //로드 가능한 플러그인은 모든 청크를 만듭니다
    new LoadablePlugin({
      outputAsset: false, // 클라이언트와 동일한 아웃풋에 loadable-stats를 쓰지 않도록 설정합니다
      writeToDisk: true,
      filename: `${BUILD_DIR}/loadable-stats.json`,
    }),
    new HtmlWebpackPlugin({
      template: resolvePath('public/index.html'),
    }),
    new BundleAnalyzerPlugin(),
  ],
  optimization: {
    runtimeChunk: 'single', // 생성된 모든 청크에서 공유되는 런타임 파일을 만듭니다.
    splitChunks: {
      chunks: 'all', // 최적화를 위해 선택되는 청크를 나타냅니다.
      automaticNameDelimiter: '-',
      cacheGroups: {
        vendor: {
          // 이름을 vendor.js로 변환합니다.
          test: /[\\/]node_modules[\\/]/,
          name: 'vendor',
          chunks: 'all',
        },
      },
    },
    minimize: false,
    minimizer: [],
  },
};

module.exports = merge(baseConfig, clientConfig);
