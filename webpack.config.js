module.exports = {
  entry: ['./login.js'],
  output: {
    path: __dirname,
    filename: "bundle.js",
  },
  module: {
    loaders: [
      {
        test: /\.js$/, 
        exclude: /node_modules/, 
        loader: "babel-loader",
        query:{
          presets: ["es2015",  "react"]
        }
      },
      {
        test: /node_modules\/JSONStream\/index\.js$/,
        loaders: ['shebang-loader', 'babel-loader']
      }
    ]
  }
}
