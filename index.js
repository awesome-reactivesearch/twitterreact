import React from "react";
import ReactDom from "react-dom";
import { Router, Route, browserHistory } from "react-router";
import { ReactiveBase } from "@appbaseio/reactivebase";
import { config } from "./src/config/config";
import Login from "./src/pages/login";
import Dashboard from "./src/pages/dashboard";
import Profile from "./src/pages/profile";
import SearchPg from "./src/pages/searchpg";

// Render Router elements into the DOM
ReactDom.render((
	<ReactiveBase
		app={config.credential_tweets.app}
		credentials={`${config.credential_tweets.username}:${config.credential_tweets.password}`}
		type={config.credential_tweets.type}
	>

		<Router history={browserHistory}>
			<Route path="/" component={Login} />
			<Route path=":uname" component={Dashboard} />
			<Route path="profile/:uname" component={Profile} />
			<Route path="search/:txt" component={SearchPg} />
		</Router>
	</ReactiveBase>
), document.getElementById("app"));
