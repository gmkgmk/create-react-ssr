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
app.listen(port, () => {
	console.log(`当前正在监听端口：${port}`);
});
