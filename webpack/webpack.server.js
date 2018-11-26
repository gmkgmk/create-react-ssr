const path = require("path");
const nodeExternals = require("webpack-node-externals");
const webpack = require("webpack");

module.exports = {
	mode: "development",
	entry: [path.resolve(__dirname, "../server/app.js")],
	target: "node",
	externals: [nodeExternals()],
	output: {
		path: path.resolve(__dirname, "../dist"),
		filename: "server.js"
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
		new webpack.DefinePlugin({
			__isService: true //用来区分是不是服务器端，后面会使用
		})
	]
};