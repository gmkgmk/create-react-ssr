import App from "./app.js";
import React from "react";
import { hydrate } from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";

hydrate(
	<Router>
		<App/>
	</Router>,
	document.getElementById("root")
);
