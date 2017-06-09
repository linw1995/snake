const path = require('path')
const glob = require('glob')
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const PurifyCSSPlugin = require('purifycss-webpack')

module.exports = function (env) {
  const extractSass = new ExtractTextPlugin({
    filename: 'css/[name].css?[contenthash:8]',
    disable: env !== 'production',
    allChunks: true
  })

  return {
    entry: {
      bundle: './src/js/demo.js',
      styles: './src/styles/main.scss'
    },
    output: {
      path: path.resolve(__dirname, 'dist'),
      publicPath: '',
      filename: `js/[name].js${env === 'production' ? '?[chunkhash:8]' : ''}`
    },
    resolve: {
      extensions: ['*', '.js']
    },
    module: {
      loaders: [{
          test: /\.(js|jsx)$/,
          use: 'babel-loader'
        }, {
          test: /[.]html$/,
          loader: 'html-loader?' + JSON.stringify({
            pretty: true
          })
        }, {
          test: /\.scss$/,
          use: extractSass.extract({
            use: ['css-loader?sourceMap', 'sass-loader?sourceMap'],
            fallback: 'style-loader',
            publicPath: '../'
          })
        }, {
          test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
          loader: 'url-loader?limit=10000&mimetype=application/font-woff' +
            '&hash=sha512&digest=hex&name=fonts/[name].[ext]?[hash:8]'
        },
        {
          test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
          loader: 'file-loader?hash=sha512&digest=hex&name=fonts/[name].[ext]?[hash:8]'
        }, {
          test: /\.(jpe?g|png|gif|svg|ico)$/,
          loaders: [
            'file-loader?hash=sha512&digest=hex&name=images/[name].[ext]?[hash:8]'
          ]
        }
      ]
    },
    plugins: [
      extractSass,
      new HtmlWebpackPlugin({
        template: 'src/index.html'
      }),
      new PurifyCSSPlugin({
        paths: glob.sync(path.join(__dirname, 'src/*.html'))
      }), new webpack.optimize.UglifyJsPlugin({
        sourceMap: false,
        mangle: false
      })
    ],
    devServer: {
      host: '127.0.0.1',
      disableHostCheck: true
    },
    devtool: env === 'production' ? false : 'source-map'
  }
}
