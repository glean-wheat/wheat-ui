const TerserPlugin = require('terser-webpack-plugin')
const glob = require('glob')
const getEntry = () => {
  const entry = {
    'wheat.ui.min': ['../src/index.js']
  }
  let srcDirName = '../src/*/index.js'
  glob.sync(srcDirName).forEach(function(name) {
    let n = name.slice(0, name.length - 9)
    n = n.slice(n.lastIndexOf('/')).split('/')[1]
    entry[n] = [`./src/${n}/index.js`]
  })
  return entry
}
module.exports = {
  entry: {
    'wheat.ui.min': '../src/index.js',
    ...getEntry()
  },
  output: {
    filename: '[name].js',
    chunkFilename: '[name].js'
  },
  devServer: {
    contentBase: '../dist'
  },
  mode: 'none',
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },

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
