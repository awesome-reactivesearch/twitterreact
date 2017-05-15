import React from "react";
import { Link } from "react-router";
import { NavOptions } from "./navoptions";

// `NavBar` component that returns navigation bar component
// NavBar contains Search Form<br />
// NavBar uses NavOptions to add buttons depending upon the current page.<br /><br />
const NavBar = props =>
    (
        <div className="navbar-fixed">
            <nav>
                <div className="nav-wrapper">
                    <div>
                        <Link to={"/"}>Twitter on Appbase</Link>
                    </div>
                    <div className="searchBarBlock">
                        <form onSubmit={props.onSearch}>
                            <input type="text blue accent-2" placeholder="Search Tweets..." />
                            <button type="submit" className="waves-effect waves-light btn buttonNavOptions">Search</button>
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
