const path = require("path");
const webpack = require("webpack");

module.exports = {
	mode: "development",
	entry: [
		path.resolve(__dirname, "../web"),
		"webpack-dev-server/client?http://localhost:8080"
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
	devServer: {
		contentBase: path.resolve(__dirname, "../web"), //对外提供的访问内容的路径
		hot: true,
		compress: true,
		port: 8080,
		open: true,
		index: "index.html",
		historyApiFallback: true,
		before: function(app) {
			app.get("*", function(req, res, next) {
				next();
			});
		}
	}
};
