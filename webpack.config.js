const TerserPlugin = require('terser-webpack-plugin')

module.exports = {
  entry: {
    'wheat.ui.min': './src/index.js'
  },
  output: {
    filename: '[name].js',
    library: 'wheatui',
    libraryTarget: 'umd',
    libraryExport: 'default'
  },
  mode: 'none',
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
        include: /\.min\.js$/
      })
    ]
  }
}
