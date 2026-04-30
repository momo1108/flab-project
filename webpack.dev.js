const path = require('path');
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'eval-cheap-module-source-map', // 빠른 빌드와 디버깅을 위한 소스맵 설정
  devServer: {
    open: true,
    host: 'localhost',
    port: 3000,
    static: path.resolve(__dirname, 'public'), // 정적 파일을 제공할 디렉토리
    hot: true, // 핫 모듈 교체 활성화
    historyApiFallback: true, // 히스토리 API를 사용하는 SPA에 유용
  },
  plugins: [new ReactRefreshWebpackPlugin()],
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/i,
        loader: 'babel-loader',
        exclude: ['/node_modules/'],
        options: {
          plugins: [require.resolve('react-refresh/babel')],
        },
      },
      {
        test: /\.css$/i,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: {
                namedExport: false,
              },
            },
          },
        ],
      },
    ],
  },
});
