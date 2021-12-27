const glob = require('glob')
const path = require('path')

const SRC_FILES = glob.sync('./src/**/*.ts').reduce(function (obj, el) {
  obj[path.parse(el).name] = el
  return obj
}, {})

//console.log('src', SRC_FILES)

module.exports = {
  mode: 'production',
  target: 'node',
  devtool: 'inline-source-map',
  entry: './src/game/game.ts', // SRC_FILES
  output: {
    filename: 'settlers.js',
    path: path.resolve(__dirname, 'dist'),
  },
  resolve: {
    extensions: ['.webpack.js', '.web.js', '.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: [
          {
            loader: 'ts-loader',
            options: { configFile: 'dist_tsconfig.json' },
          },
        ],
        exclude: /node_modules/,
      },
    ],
  },
}
