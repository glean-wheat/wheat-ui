const TerserPlugin = require('terser-webpack-plugin')
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const glob = require('glob')
const PROJ_ROOT = path.dirname(__dirname)
const resolve = (...paths) => path.resolve(PROJ_ROOT, ...paths)
const getEntry = () => {
  const entry = {
    'wheat.ui.min': [resolve('src/index.js')]
  }
  let srcDirName = resolve('src/*/index.js')
  glob.sync(srcDirName).forEach(function(name) {
    let n = name.slice(0, name.length - 9)
    n = n.slice(n.lastIndexOf('/')).split('/')[1]
    entry[n] = [resolve(`src/${n}/index.js`)]
  })
  return entry
}

module.exports = {
  entry: {
    'wheat.ui.min': resolve('../src/index.js'),
    ...getEntry()
  },
  output: {
    filename: '[name].js',
    chunkFilename: '[name].js'
  },
  devServer: {
    contentBase: '../dist',
    hot: true
  },
  mode: 'none',
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [
          {
            loader: 'style-loader',
            options: {
              esModule: true,
              modules: {
                namedExport: true
              }
            }
          },
          {
            loader: 'css-loader',
            options: {
              esModule: true,
              modules: {
                namedExport: true
              }
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
      template: resolve('src/button/index.html')
    })
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
