# React 服务端渲染

```bash
react服务端渲染到现在阶段已经发展的很成熟了，生态圈的各种库关于服务端渲染的API也已经非常成熟了，个人建议可以自己去尝试一下，有什么不懂的再到网上查找资料，毕竟踩坑的过程也很重要。
```

服务端渲染 React 应该是一个老生常谈的概念了，它会带来 1 以性能和和 SEO 为代表的一些好处， 在这篇文章中，我们将从头开始，慢慢构建成一个服务端渲染呈现 React.
(本文不会涉及太多的概念和原理，只会呈现一个简单的 react 服务端渲染过程)

## 开始前介绍

**任务之前我们需要列一下需要完成的几个点。**

**一. 初始化项目。**

**二. 初始化一个 react 组建。**

**三. 初始化一个服务器**

**四. 通过服务端渲染 react。**

### 一.初始化项目

首先快速初始化一个  空项目

通过

```js
  npm init -y
```

进行初始化

### 二.初始化一个 react 组建

下载 react 依赖

```js
    npm install react react-dom react-router react-router-dom --save-dev
```

我使用的是 react16.6 + react-router4X 版本

现在在根目录下创建一个 web 文件夹，我们用来存放 web 端的代码

#### 1. 在 web 文件夹里面创建一个 index.js 作为程序的入口

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

#### 2. 再创建一个 app.js 文件，作为程序的主要内容

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

#### 3. 配置 webpack

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
        new webpack.NamedModulesPlugin()，
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
```

#### 4. 安装 babel 依赖

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

#### 5. 最后需要一个页面，在 web 文件夹里存放一个页面

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

打开浏览器 http://localhost:8080

![初始化react](https://github.com/gmkgmk/create-react-ssr/blob/master/_img/step1-image2.png)

再看看项目代码结构

![初始化react-项目代码结构](https://github.com/gmkgmk/create-react-ssr/blob/master/_img/step1-image1.jpg)

### 三.初始化一个服务器

我们选用 Koa 为基础搭建服务器,来搭建一个简单的服务器

首先依然是下载依赖

```js
    npm install koa nodemon --save-dev
```

现在我们需要在有一个文件夹存放服务端的代码，在根目录下创建一个文件夹 server，创建一个文件 app.js (server/app.js)

编写服务端的代码

```js
const koa = require("koa");
const app = new koa();
const port = 3000;

const serverSideRender = async ctx => {
	ctx.body = { name: "hello world" };
};
app.use(serverSideRender);
app.listen(port, () => {});
```

然后在命令行输入

```.bash
node ./server/app.js
```

打开浏览器 http://localhost:3000

![初始化服务器](https://github.com/gmkgmk/create-react-ssr/blob/master/_img/step2-image1.jpg)

到这一步服务器就搭建好了，但是这还远远不够，现在我们还需要做一些准备工作，来让我们后面更好的开发，因为 react 服务端渲染，那么肯定需要在服务端运行 react 代码，但是 node 不认识 import，jsx 这些代码，所以需要将这部分代码转换为 node 认识的代码。

 现在下载一个依赖，让 webpack 不捆绑它的 node_modules 依赖项（减少大小，只需要 require('module') 方式引入）

```.bash
    npm install webpack-node-externals --save
```

编写 webpack 配置

```js
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
```

现在还需要修改一下 package 配置，否则一直通过命令行输入太麻烦

```json
{
	"name": "demo",
	"version": "1.0.0",
	"description": "",
	"main": "index.js",
	"scripts": {
		"server": "webpack -w --config ./webpack/webpack.server.js & nodemon ./dist/server.js"
	},
	"keywords": [],
	"author": "",
	"license": "ISC",
	"devDependencies": {
		"koa": "^2.6.2",
		"nodemon": "^1.18.6",
		"react": "^16.6.3",
		"react-dom": "^16.6.3",
		"react-router": "^4.3.1",
		"react-router-dom": "^4.3.1",
		"webpack": "^4.26.1",
		"webpack-cli": "^3.1.2",
		"webpack-dev-server": "^3.1.10"
	},
	"dependencies": {
		"@babel/core": "^7.1.6",
		"@babel/plugin-proposal-class-properties": "^7.1.0",
		"@babel/polyfill": "^7.0.0",
		"@babel/preset-env": "^7.1.6",
		"@babel/preset-react": "^7.0.0",
		"babel-loader": "^8.0.4",
		"webpack-node-externals": "^1.7.2"
	}
}
```

就此，服务器和 web 端已经能够正常跑起来了，现在我们尝试使用服务器进行渲染。

## 通过服务器进行渲染

首先我们需要对服务端进行改造

-   react 服务端渲染，那么服务端肯定需要使用 react,所以我们需要首先引入 react 与 reactDom
-   通过服务端返回 html 信息

吧/server/app.js 改造如下

```js
const koa = require("koa");
const app = new koa();
const port = 3000;
import React from "react";
import { renderToString } from "react-dom/server";
import { StaticRouter, matchPath } from "react-router-dom";
import App from "./../web/app";

const createHtml = innerHtml => {
	return `
    <!DOCTYPE html>
    <html>
        <head>
            <meta charset="UTF-8" />
            <title>服务端渲染</title>
        </head>
        <body>
            <div id="root">${innerHtml}</div>
        </body>
    </html>`;
};

const serverSideRender = async ctx => {
	const markUp = renderToString(
		<StaticRouter location={ctx.url} context={{}}>
			<App />
		</StaticRouter>
	);
	ctx.body = createHtml(markUp);
};
app.use(serverSideRender);
app.listen(port, () => {});
```

**renderToString 和 StaticRouter 方法分别是 reactDom 和 reactRouter 的 api,官方的文档很全面，可以先去了解一下**

打开 localhost:3000 可以看到，现在浏览器已经可以通过服务端渲染出 react 内容了

![服务器渲染react](https://github.com/gmkgmk/create-react-ssr/blob/master/_img/step3-image1.jpg)

但是现在还不够哦，现在只是传输静态页面，而且服务端渲染后，前端没有再次渲染，管理权一直在服务器这边，每次都会向服务器发送请求。

我们先通过服务器请求一些数据.需要在服务端请求数据，所以我们引入一个方法库，能够在服务端使用 fetch.

```js
 npm install node-fetch --save-dev
```

然后在创建一个文件夹来管理请求数据

我在 web 文件夹内创建/service/home.js 里添加一些内容；

```js
import fetch from "node-fetch";

export function query() {
	return fetch("https://jsonplaceholder.typicode.com/posts")
		.then(res => res.json())
		.then(data => data)
		.catch(err =>
}
```

然后再次改造服务端,获取数据后将数据依附到 window 上，传向 web 端，（后面 web 端也会请求一次数据，渲染）

```js
const koa = require("koa");
const app = new koa();
const port = 3000;
import React from "react";
import { renderToString } from "react-dom/server";
import { StaticRouter, matchPath } from "react-router-dom";
import App from "./../web/app";
import { query } from "../../ssr/web/services/home";
const createHtml = (innerHtml, data) => {
	return `
    <!DOCTYPE html>
    <html>
        <head>
            <meta charset="UTF-8" />
            <title>服务端渲染</title>
        </head>
        <body>
            <div id="root">${innerHtml}</div>
            <script>window.INITIAL_DATA = ${JSON.stringify(data)}</script>
        </body>
    </html>`;
};

const fetchData = async () => {
	return await query();
};

const serverSideRender = async ctx => {
	const data = await fetchData();
	const markUp = renderToString(
		<StaticRouter location={ctx.url} context={{}}>
			<App />
		</StaticRouter>
	);
	ctx.body = createHtml(markUp, data);
};
app.use(serverSideRender);
app.listen(port, () => {});
```

打开浏览器：3000 已经可以看到数据了

![服务器渲染react,获取数据](https://github.com/gmkgmk/create-react-ssr/blob/master/_img/step3-image2.jpg)

让我们暂时将关注点转回 web 端。

由于不同页面进入的数据肯定是不同的，所以我们需要将路由信息，改造一下。

独立一个 router 配置 /route/index.js （这里只是一个简单的列子，吧页面也放入这个文件，真实项目需要根据自己的修改）

```js
/**
 * import page;
 * 引入react组建
 */
import React from "react";
class Home extends React.Component {
	state = {
		data: []
	};
	constructor(props) {
		super(props);
	}
	componentDidMount() {
		this.fetchData();
	}
	fetchData = async () => {
		const result = await this.props.loadData();
		this.setState({
			data: [result]
		});
	};
	render() {
		// 获取数据时同归promiseAll获取，返回的是一个元祖
		const [data] = this.state.data;
		return (
			<div>
				<div>主页</div>
				{data &&
					data.map(item => {
						return (
							<ol
								key={item.id}
								style={{ border: "1px solid #555" }}
							>
								<li>id:{item.id}</li>
								<li>标题:{item.title}</li>
								<li>用户id:{item.userId}</li>
								<li>内容:{item.body}</li>
							</ol>
						);
					})}
			</div>
		);
	}
}

class Todo extends React.Component {
	render() {
		return <div>todo</div>;
	}
}

import { query } from "./../web/service/home";
const router = [
	{ path: "/todo", component: Todo },
	{
		path: "/home",
		component: Home,
		loadData: async () => {
			return query();
		}
	}
];

export default router;
```

相应的主页也需要进行修改 /web/app.js

```js
import React from "react";
import { Route, Switch, Link, Redirect } from "react-router-dom";
import routes from "../route";

export default function() {
	return (
		<>
			<header>
				<nav>
					<li>
						<Link to="/todo">todo</Link>
					</li>
					<li>
						<Link to="/home">home</Link>
					</li>
				</nav>
			</header>
			<section>
				<Switch>
					{routes.map(({ path, component: Com, ...rest }) => (
						<Route
							path={path}
							render={props => <Com {...props} {...rest} />}
							key={path}
						/>
					))}
					<Route
						exact
						path="/"
						render={() => <Redirect to="/home" />}
					/>
				</Switch>
			</section>
		</>
	);
}
```

**<Com {...props} {...rest}/>}** 在这里我们将 route 里的配置都传给组建

打开浏览器 8080 端口，这就是一个标准的 react 请求渲染。

现在需要做一些不同的东西。

修改一下入口文件。 /web/index.js

```js
import App from "./app.js";
import React from "react";
import { hydrate } from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";

hydrate(
	<Router>
		<App />
	</Router>,
	document.getElementById("root")
);
```

将 render 改为 hydrate

现在再打开会发现一个报错，但是先忽略，这是因为用了服务端渲染的方法，但是却是通过 web 端进行渲染

现在修改一下 web 端的 webpack 配置，因为是服务端渲染，所以不需要 webpack-dev-server

```js
const path = require("path");
const webpack = require("webpack");

module.exports = {
	mode: "development",
	entry: [path.resolve(__dirname, "../web")],
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
	]
};
```

在 package.json 里配置一下

```json
"scripts": {
    "web":"webpack -w --config ./webpack/webpack.web.js",
    "server": "webpack -w --config ./webpack/webpack.server.js & nodemon ./dist/server.js"
  },
```

然后 npm run web 进行打包

现在，我们回到服务端。

我们需要对比当前访问的路由和路由配置里的是否相同，然后来调用不同的请求，再将数据传到 web 端，并通过页面读取刚才打包的 web 端 js 文件

下载 koa-static 让我们能够访问刚才打包的文件夹

```
npm install koa-static --save-dev
```

修改/server/app.js

```js
const koa = require("koa");
const app = new koa();
const port = 3000;
import React from "react";
import { renderToString } from "react-dom/server";
import { StaticRouter, matchPath } from "react-router-dom";
import App from "./../web/app";
import Routes from "./../route";
import koaStatic from "koa-static";

app.use(koaStatic("public"));

const createHtml = (innerHtml, data) => {
	return `
    <!DOCTYPE html>
    <html>
        <head>
            <meta charset="UTF-8" />
            <title>服务端渲染</title>
            <script src="/main.js" defer></script>
        </head>
        <body>
            <div id="root">${innerHtml}</div>
            <script>window.INITIAL_DATA = ${JSON.stringify(data)}</script>
        </body>
    </html>`;
};

// 匹配路由
const findRoute = async url => {
	const promises = [];

	Routes.some(route => {
		const match = matchPath(url, route.path);
		if (match && route.loadData) promises.push(route.loadData(match));
		return;
	});

	const data = await Promise.all(promises);
	return data;
};
const serverSideRender = async ctx => {
	const data = await findRoute(ctx.url);
	const markUp = renderToString(
		<StaticRouter location={ctx.url} context={{ data: data }}>
			<App />
		</StaticRouter>
	);
	ctx.body = createHtml(markUp, data);
};
app.use(serverSideRender);
app.listen(port, () => {});
```

现在打开浏览器：3000

可以看到数据返回到 web 端，但是 web 端依然会请求一次数据

最后我们需要修改 web 端组件：

```js
/**
 * import page;
 * 引入react组建
 */
import React from "react";
class Home extends React.Component {
	state = {
		data: __isService ? this.props.staticContext.data : window.INITIAL_DATA
	};
	constructor(props) {
		super(props);
	}
	componentDidMount() {
		if (!__isService) {
			this.fetchData();
		}
	}
	fetchData = async () => {
		const result = await this.props.loadData();
		this.setState({
			data: [result]
		});
	};
	render() {
		// 获取数据时同归promiseAll获取，返回的是一个元祖
		const [data] = this.state.data;
		return (
			<div>
				<div>主页</div>
				{data &&
					data.map(item => {
						return (
							<ol
								key={item.id}
								style={{ border: "1px solid #555" }}
							>
								<li>id:{item.id}</li>
								<li>标题:{item.title}</li>
								<li>用户id:{item.userId}</li>
								<li>内容:{item.body}</li>
							</ol>
						);
					})}
			</div>
		);
	}
}

class Todo extends React.Component {
	render() {
		return <div>todo</div>;
	}
}

import { query } from "./../web/service/home";
const router = [
	{ path: "/todo", component: Todo },
	{
		path: "/home",
		component: Home,
		loadData: async () => {
			return query();
		}
	}
];

export default router;
```

看看最终的效果

从home进入

![home](https://github.com/gmkgmk/create-react-ssr/blob/master/_img/step3-image3.jpg)

从todo进入
![todo](https://github.com/gmkgmk/create-react-ssr/blob/master/_img/step3-image4.jpg)


因为最近比较忙，可能总结的不是很到位，如果有什么不清楚的，可以加我微信一起交流技术：
微信号: G-Goodwin

最后附上一张网上大神总结的服务端渲染原理图，侵删

![ssr](https://github.com/gmkgmk/create-react-ssr/blob/master/_img/ssr.png)
