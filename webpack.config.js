const webpack = require('webpack');
const path = require('path');
const Plugin = {
  CleanWebpack: require('clean-webpack-plugin'),
  UglifyJs: require('uglifyjs-webpack-plugin'),
  MiniCssExtract: require('mini-css-extract-plugin'),
  HtmlWebpack: require('html-webpack-plugin'),
};

module.exports = env => {
  const isDev = env && env.NODE_ENV === 'development';

  return {
    mode: isDev ? 'development' : 'production',
    devtool: isDev ? 'eval-source-map': 'source-map',
    optimization: {
      minimize: !isDev,
      minimizer: [new Plugin.UglifyJs()]
    },
    context: path.resolve(__dirname, 'src'),
    entry: ['./index.tsx', './index.scss'],
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: '[name].bundle.js',

    },
    devServer: {
      host: '0.0.0.0',
      port: 4200,
      compress: true,
      clientLogLevel: 'debug',
      publicPath: '/',
      historyApiFallback: true,
    },
    plugins: [
      new Plugin.MiniCssExtract({
        filename: '[name].css',
        chunkFilename: '[id].css'
      }),
      new Plugin.CleanWebpack(['dist']),
      new Plugin.HtmlWebpack({
        template: 'index.html',
        filename: 'index.html'
      })
    ],
    resolve: {
      extensions: [' ', '.tsx', '.ts', '.jsx', '.js']
    },
    module: {
      rules: [
        {
          test: /\.html$/,
          use: 'html-loader'
        },
        {
          test: /\.s(c|a)ss$/,
          use: [
            isDev ? 'style-loader' : Plugin.MiniCssExtract.loader, // inserts css into the DOM (links or inside tags and other ways)
            'css-loader', // executes @import as Js import/require
            'postcss-loader', // executes postcss enabled features
            'sass-loader' // transpiles sass/scss to css
          ]
        },
        {
          test: /\.js(x?)$/,
          exclude: /node_modules/,
          use: [{
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-react', '@babel/preset-env'],
              plugins: ['@babel/transform-react-jsx-img-import']
            }
          }]
        },
        {
          test: /\.ts(x?)$/,
          exclude: /node_modules/,
          use: 'ts-loader'
        },
        {
          test: /\.(jpe?g|png|gif|svg)$/i,
          use: [
            {
              loader: 'file-loader',
            },
            {loader: 'image-webpack-loader'}
          ]
        },

      ]
    }
  }
}
