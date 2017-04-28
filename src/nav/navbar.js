import React from "react";
import { Link } from "react-router";
import { NavOptions } from "./navoptions";

// `NavBar` component that returns navigation bar component
// NavBar contains Search Form<br />
// NavBar uses NavOptions to add buttons depending upon the current page.<br /><br />
const NavBar = props =>
    (
        <div className="navbar-fixed">
            <nav id="navbar">
                <div className="nav-wrapper" id="navBarWrapper">
                    <div id="txtAppbase">
                        <Link id="linktxt" to={"/"}>Twitter on Appbase</Link>
                    </div>
                    <div id="searchBarBlock">
                        <form onSubmit={props.onSearch}>
                            <input type="text blue accent-2" id="searchtxt" placeholder="Search Tweets..." />
                            <button type="submit" id="searchbutton" className="waves-effect waves-light btn">Search</button>
                        </form>

                    </div>
                    <NavOptions
                        pflg={props.pflg}
                        path={props.path}
                        user={props.user}
                        goProfile={props.goProfile}
                        goGlobalFeed={props.goGlobalFeed}
                        goPresonalFeed={props.goPresonalFeed}
                        logOut={props.logOut}
                    />

                </div>
            </nav>
        </div>
    );
module.exports = {
    NavBar
};
