const path = require("path");

module.exports = {
	entry: ["./src/index.js"],

	output: {
		path: path.join(__dirname, "dist"),
		publicPath: "dist/",
		filename: "bundle.js"
	},
	devtool: "inline-sourcemap",
	devServer: {
		inline: true,
		port: 8080,
		contentBase: "./",
		historyApiFallback: {
			index: "./index.html"
		}
	},
	module: {
		loaders: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				loader: "babel-loader",
				query: {
					presets: ["es2015", "react"]
				}
			},
			{
				test: /\.css$/,
				loaders: ["style-loader", "css-loader"]
			},
			{
				test: /node_modules\/JSONStream\/index\.js$/,
				loaders: ["shebang-loader", "babel-loader"]
			},
			{
				test: /\.(ttf|eot|svg|woff(2)?)(\?[a-z0-9=&.]+)?$/,
				loader: "file-loader"
			}

		],
		noParse: ["ws"]
	},
	externals: ["ws"]
};
