const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: './app/javascripts/app.js',
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'app.js',
    // publicPath: '/build/assets',
    library: 'EntryPoint'
  },
  plugins: [
    // Copy our app's index.html to the build folder.
    new CopyWebpackPlugin([
      {from: './app/index.html', to: 'index.html'},
      {from: './app/assets', to: 'assets'},
      {from: './app/images', to: 'images'},
      {from: './app/stylesheets', to: 'stylesheets'}
    ])
  ],
  devServer: {
    contentBase: "./build"
  },
  module: {
    rules: [
      {test: /\.png$/, use: 'file-loader'},
      {test: /\.svg$/, use: 'file-loader'},
      {test: /\.gif$/, use: 'file-loader'},
      {test: /\.jpg$/, use: 'file-loader'},
      {test: /\.eot$/, use: 'file-loader'},
      {test: /\.woff.*$/, use: 'file-loader'},
      {test: /\.ttf$/, use: 'file-loader'},
      {
        test: /\.css$/, use: ['style-loader', 'css-loader']
      }
    ],
    loaders: [
      {test: /\.png$/, use: 'file-loader'},
      {test: /\.json$/, use: 'json-loader'},
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015'],
          plugins: ['transform-runtime']
        }
      }
    ]
  }

};