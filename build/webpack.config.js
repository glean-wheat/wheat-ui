const TerserPlugin = require('terser-webpack-plugin')
const glob = require('glob')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyPlugin = require("copy-webpack-plugin");
const path = require('path')
const PROJ_ROOT = path.dirname(__dirname)
const resolve = (...paths) => path.resolve(PROJ_ROOT , ...paths)
const getEntry = () => {
  const entry = {
    'wheat.ui.min': ['./src/index.js']
  }
  let srcDirName = './src/*/index.js'
  glob.sync(srcDirName).forEach(function(name) {
    let n = name.slice(0, name.length - 9)
    n = n.slice(n.lastIndexOf('/')).split('/')[1]
    entry[n] = [`./src/${n}/index.js`]
  })
  return entry
}
module.exports = {
  entry: {
    'wheat.ui.min': './src/index.js',
    ...getEntry()
  },
  output: {
    filename: '[name].js',
    chunkFilename: '[name].js'
  },
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
    port: 9000,
  },
  mode: 'none',
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [{
          loader: "css-loader",
            options: {
              esModule: false,
              modules: {
                exportLocalsConvention: 'asIs',
              },
            }
          },
          "sass-loader"
        ]
      },
      {
        test: /\.css$/,
        use: [{
          loader: "css-loader",
            options: {
              esModule: false,
              modules: {
                exportLocalsConvention: 'asIs',
              },
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Custom template',
      // Load a custom template (lodash by default)
      template: resolve('index.html')
    }),
    new CopyPlugin( [
        { from: resolve('src/base-css'), to: resolve('dist/static') }
      ]),
  ],
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          output: {
            comments: false
          }
        },
        extractComments: false,
        include: /\.js$/
      })
    ]
  }
}
