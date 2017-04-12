import React from "react";
import ReactDom from "react-dom";
import { Router, Route, browserHistory } from "react-router";
import { ReactiveBase } from "@appbaseio/reactivesearch";
import { config } from "./config/config";
import Login from "./pages/login";
import Dashboard from "./pages/dashboard";
import Profile from "./pages/profile";
import SearchPg from "./pages/searchpg";

// Render Router elements into the DOM
ReactDom.render((
	<ReactiveBase
		app={config.credential_tweets.app}
		credentials={`${config.credential_tweets.username}:${config.credential_tweets.password}`}
		type={config.credential_tweets.type}
	>

		<Router history={browserHistory}>
			<Route path="/twitterreact/" component={Login} />
			<Route path="/twitterreact/:uname" component={Dashboard} />
			<Route path="/twitterreact/profile/:uname" component={Profile} />
			<Route path="/twitterreact/search/:txt" component={SearchPg} />
		</Router>
	</ReactiveBase>
), document.getElementById("app"));
