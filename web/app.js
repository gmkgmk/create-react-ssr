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
