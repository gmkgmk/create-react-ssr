const koa  = require("koa");
const app = new koa();
const port = 3000;

const serverSideRender = async ctx => {
    ctx.body = {name:"hello world"}
};
app.use(serverSideRender);
app.listen(port, () => {});
