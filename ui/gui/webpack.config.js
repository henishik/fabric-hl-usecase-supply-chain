var webpack = require('webpack');
var path = require('path');

module.exports = {
  debug: true,
  devtool: 'eval',
  /**
   * # Entry definitions -------------------------------------------------------
   * @fiename
   * @path
   * @publicPath
   */
  entry: [
    'webpack-dev-server/client?http://localhost:9999',
    'webpack/hot/only-dev-server',
    './src/app/index.js'
  ],

  /**
   * # Output definitions ------------------------------------------------------
   * @fiename
   * @path
   * @publicPath
   */
  output: {
    path: path.join(__dirname, 'dist/js'),
    filename: 'app.js',
    publicPath: '/static/'
  },

  /**
   * # Resolve definitions ------------------------------------------------------
   * @extensions
   */
  resolve: {
    extensions: ['', '.jsx', '.js', '.tsx', '.ts']
  },

  module: {
    loaders: [{
      test: /\.js?$/,
      exclude: /node_modules/,
      loaders: ['babel']
    },
    {
      test: /\.scss$/,
      loaders: ['style', 'css?sourceMap', 'sass?sourceMap']
    },
    {
      test: /\.(png|jpg)?$/,
      loader: 'file-loader'
    },
    {
      test: /\.svg$/,
      loader: 'svg-sprite'
    }]
  },

  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  ],
};
