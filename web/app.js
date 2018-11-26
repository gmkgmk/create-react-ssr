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
