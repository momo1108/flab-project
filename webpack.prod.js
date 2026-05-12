const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const CSSMinimizerPlugin = require('css-minimizer-webpack-plugin');

module.exports = merge(common, {
  mode: 'production',
  entry: {
    main: {
      import: './src/index.tsx',
      dependOn: ['reactvendors'],
    },
    reactvendors: ['react', 'react-dom', 'react-dom/client'],
  },
  devtool: false,
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css',
    }),
    new BundleAnalyzerPlugin(),
  ],
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/i,
        loader: 'babel-loader',
        exclude: ['/node_modules/'],
      },
      {
        test: /\.css$/i,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              modules: {
                namedExport: false,
              },
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                // browsers 옵션이 제공되지 않으면 default browserslist query 가 사용됨
                // https://github.com/csstools/postcss-preset-env#browsers
                plugins: ['postcss-preset-env'],
              },
            },
          },
        ],
      },
    ],
  },
  optimization: {
    minimize: true, // 코드 경량화 활성화
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: true, // 공백, 주석 제거 등 코드 최소화
          mangle: true, // 변수명, 함수명 난독화
        },
        extractComments: false, // 라이선스 주석 등의 별도 파일 추출을 비활성화
      }),
      new CSSMinimizerPlugin(),
    ],
    splitChunks: {
      chunks: 'all',
    },
  },
});
