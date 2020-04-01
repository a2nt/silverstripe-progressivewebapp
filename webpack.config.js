const SOURCEDIR = './src';
const COMPRESS = false;

const webpack = require('webpack');
const path = require('path');
const filesystem = require('fs');

const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

const plugins = [
  new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: JSON.stringify('production'),
    },
  }),
  new HardSourceWebpackPlugin(),
  new webpack.LoaderOptionsPlugin({
    minimize: COMPRESS,
    debug: false,
  }),
];

const dirPath = path.resolve(__dirname, 'client/src/');
const includes = {
  app: path.join(dirPath, 'app.js'),
  sw: path.join(dirPath, 'sw.js'),
};

module.exports = {
  entry: includes,
  output: {
    path: path.resolve(__dirname, 'client', 'dist'),
    filename: path.join('[name].js'),
    publicPath: path.resolve(__dirname, 'client', 'dist'),
  },
  devtool: COMPRESS ? '' : 'source-map',
  externals: {},
  optimization: {
    namedModules: true,
    splitChunks: {
      name: 'vendor',
      minChunks: 2,
    },
    noEmitOnErrors: true,
    concatenateModules: true,
    minimizer: COMPRESS
      ? [
          new TerserPlugin({
            terserOptions: {
              parse: {
                ecma: 8,
              },
              compress: {
                ecma: 5,
                warnings: false,
                comparisons: false,
              },
              mangle: {
                safari10: true,
              },
              output: {
                ecma: 5,
                comments: false,
                ascii_only: true,
              },
            },
            parallel: true,
            cache: true,
          }),
        ]
      : [],
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            cacheDirectory: true,
            cacheCompression: false,
          },
        },
      },
      {
        test: /\.worker\.js$/,
        use: {
          loader: 'worker-loader',
        },
      },
    ],
  },
  resolve: {
    modules: [
      path.resolve(__dirname, 'src'),
      path.resolve(__dirname, 'node_modules'),
    ],
  },
  plugins: plugins,

  devServer: {
    host: '127.0.0.1',
    port: 8001,
    historyApiFallback: true,
    hot: false,
    clientLogLevel: 'info',
    contentBase: [
      path.resolve(__dirname, 'client/src'),
      path.resolve(__dirname, 'node_modules'),
      path.resolve(__dirname, 'client/dist'),
    ],
    //watchContentBase: true,
    overlay: {
      warnings: true,
      errors: true,
    },
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  },
};
