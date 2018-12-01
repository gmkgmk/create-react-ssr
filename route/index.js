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
