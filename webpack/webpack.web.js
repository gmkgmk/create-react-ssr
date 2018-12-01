const path = require("path");
const webpack = require("webpack");

module.exports = {
	mode: "development",
	entry: [
		path.resolve(__dirname, "../web"),
	],
	output: {
		path: path.resolve(__dirname, "../public")
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				use: {
					loader: "babel-loader"
				}
			}
		]
	},
	plugins: [
		new webpack.HotModuleReplacementPlugin(),
		new webpack.NamedModulesPlugin(),
		new webpack.DefinePlugin({
			__isService: false
		})
	],
};
