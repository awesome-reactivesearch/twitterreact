import React from "react";
import { Link } from "react-router";
import { NavOptions } from "./navoptions";

// `NavBar` component that returns navigation bar component
// NavBar contains Search Form<br />
// NavBar uses NavOptions to add buttons depending upon the current page.<br /><br />
const NavBar = props =>
    (
        <div className="navbar-fixed">
            <nav style={{ color: "black", backgroundColor: "#dadada", height: "60px" }}>
                <div className="nav-wrapper" style={{ margin: "0.4% auto auto auto" }} >
                    <div style={{ float: "left", fontSize: "130%", width: "15%", margin: "-0.6% auto 2% 2.5%" }}>
                        <Link to={"/"} style={{ color: "black" }}>Twitter on Appbase</Link>
                    </div>
                    <div style={{ width: "30%", float: "left" }}>
                        <form id="searchbar" onSubmit={props.onSearch}>
                            <input type="text blue accent-2" style={{ height: "65%", width: "45%", margin: "1% 0 0 0" }} placeholder="Search Tweets..." />
                            <input type="submit" value="Search" style={{ width: "20%", fontSize: "16px", height: "40px", textTransform: "capitalize", marginTop: "-1%" }} className="waves-effect waves-light btn" />
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
