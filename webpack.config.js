/* eslint-disable */
const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpack = require('webpack')

module.exports = [
  {
    mode: 'development',
    entry: './src/electron.ts',
    target: 'electron-main',
    module: {
      rules: [{
        test: /\.ts$/,
        include: /src/,
        use: ['ts-loader', 'eslint-loader']
      }]
    },
    resolve: {
      extensions: ['.ts']
    },
    output: {
      path: `${__dirname}/dist`,
      filename: 'electron.js'
    },
    plugins: [
      new webpack.ExternalsPlugin('commonjs', [
        'usb'
      ])
    ]
  },
  {
    mode: 'development',
    entry: './src/app/index.tsx',
    target: 'electron-renderer',
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          exclude: [`${__dirname}/node_modules`, `${__dirname}/dist`],
          use: ['ts-loader', 'eslint-loader']
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'postcss-loader']
        }
      ]
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js']
    },
    output: {
      path: `${__dirname}/dist`,
      filename: 'piano-sheetmusic.js'
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: './src/app/index.html'
      })
    ]
  }
]