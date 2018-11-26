# React 服务端渲染

```bash
react服务端渲染到现在阶段已经发展的很成熟了，生态圈的各种库关于服务端渲染的API也已经非常成熟了，个人建议可以自己去尝试一下，有什么不懂的再到网上查找资料，毕竟踩坑的过程也很重要。
```

服务端渲染 React 应该是一个老生常谈的概念了，它会带来 1 以性能和和 SEO 为代表的一些好处， 在这篇文章中，我们将从头开始，慢慢构建成一个服务端渲染呈现 React.
(本文不会涉及太多的概念和原理，只会呈现一个简单的 react 服务端渲染过程)

## 开始前介绍

 任务之前我们需要列一下需要完成的几个点。

1. 初始化项目。

2. 初始化一个 react 组建。

3. 初始化一个服务器

4. 通过服务端渲染 react。

### 1.初始化项目

首先快速初始化一个  空项目

通过

```js
  npm init -y
```

进行初始化

### 2.初始化一个 react 组建

下载 react 依赖

```js
    npm install react react-dom react-router react-router-dom --save-dev
```

我使用的是 react16.6 + react-router4X 版本

现在在根目录下创建一个 web 文件夹，我们用来存放 web 端的代码

1. 在 web 文件夹里面创建一个 index.js 作为程序的入口

```js
import App from "./app.js";
import React from "react";
import reactDom from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";

reactDom.render(
	<Router>
		<App />
	</Router>,
	document.getElementById("root")
);
```

2. 再创建一个 app.js 文件，作为程序的主要内容

```jsx
import React from "react";
import { Route, Switch, Link, Redirect } from "react-router-dom";

class Home extends React.Component {
	render() {
		return <div>主页</div>;
	}
}

class Todo extends React.Component {
	render() {
		return <div>todo</div>;
	}
}

export default class extends React.Component {
	render() {
		return (
			<div>
				<nav>
					<li>
						<Link to="/todo">todo</Link>
					</li>
					<li>
						<Link to="/home">home</Link>
					</li>
				</nav>
				<Switch>
					<Route path="/todo" render={() => <Todo />} />
					<Route path="/home" render={() => <Home />} />
					<Route
						exact
						path="/"
						render={() => <Redirect to="/home" />}
					/>
				</Switch>
			</div>
		);
	}
}
```

3. 配置 webpack

如果只是这样的话游览器是不认识 react 代码的，所以需要将它转换成浏览器可以认识的代码（比如 import class 等），这里又需要引入 babel, 将代码进行转化，

但是转化后的代码游览器也无法直接运行，因为 babel 转码后的代码是遵循 commonJS 规范的，直接使用也会报错（但是 node 是 commonJs 规范的，node 可以直接使用转化后的代码），所以我们还需要将 babel 生成的 commonJS 规范的 es5 写法转化为可以直接运行在浏览器上面的代码，这里就需要引用到 webpack，它能根据文件之间的依赖关系，将文件进行打包。

这里涉及到 react 发展历程（es3,es5,es6,es7,stage-0 等等），模块化历程（seaJS,RequireJS,CommonJS，esModule 等等），这里就废话较多，我们继续构建。

首先是下载依赖库

```js
 npm install webpack webpack-cli webpack-dev-server --save-dev
```

在根目录下创建一个 webpack 文件夹， 在文件夹内创建一个 webpack.web.js

```js
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
		new webpack.NamedModulesPlugin()
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
```

4. 安装 babel 依赖

```js
    npm install @babel/core @babel/preset-react babel-loader @babel/plugin-proposal-class-properties  @babel/preset-env @babel/polyfill
    --save
```

@babel/core babel 的核心库

babel-loader 官网的名称很明显： Webpack plugin for Babel

@babel/preset-env 根据环境引入所需要的代码环境,不包括 stage-x 插件

@babel/polyfill 提供内置库 拟完整的 ES2015+环境（没有<第 4 阶段提案）

@babel/preset-react 引入 react 环境

@babel/plugin-proposal-class-properties 使用 react static 属性及属性初始化程序语法声明 比如： `state={...}`

在根目录下创建一个.babelrc 文件(babel 插件配置文件)

```.bash
{
	"presets": [
		[
			"@babel/preset-env",
			{
				"useBuiltIns": "usage"
			}
		],
		"@babel/preset-react"
	],
	"plugins": ["@babel/plugin-proposal-class-properties"]
}

```

5. 最后需要一个页面，在 web 文件夹里存放一个页面

有一个 id 为 root 的元素作为跟元素，

引入一个 main.js（也可以制定 webpack 中 output 的 filename 选项，没有制定默认为 main ）

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="UTF-8" />
		<title>Webpack App</title>
	</head>
	<body>
		<main id="root"></main>
		<script src="main.js" defer></script>
	</body>
</html>
```

现在运行 ./node_modules/.bin/webpack-dev-server --config ./webpack/webpack.web.js 看看效果

![初始化react](https://github.com/gmkgmk/create-react-ssr/blob/master/_img/step1-image2.png)

再看看项目代码结构

![初始化react-项目代码结构](https://github.com/gmkgmk/create-react-ssr/blob/master/_img/step1-image1.jpg)
