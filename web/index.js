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
