import React from "react";
import ReactDom from "react-dom";
import { Router, Route, browserHistory } from "react-router";
import { ReactiveBase } from "@appbaseio/reactivesearch";
import { config } from "./config/config";
import Login from "./pages/login";
import Dashboard from "./pages/dashboard";
import Profile from "./pages/profile";
import Search from "./pages/search";

// Render Router elements into the DOM
ReactDom.render((
    <ReactiveBase
        app={config.credential_appbase.app}
        credentials={config.credential_appbase.credentials}
        type="tweets"
    >

        <Router history={browserHistory}>
            <Route path="/twitterreact/" component={Login} />
            <Route path="/twitterreact/:uname" component={Dashboard} />
            <Route path="/twitterreact/profile/:uname" component={Profile} />
            <Route path="/twitterreact/search/:txt" component={Search} />
        </Router>
    </ReactiveBase>
), document.getElementById("app"));
