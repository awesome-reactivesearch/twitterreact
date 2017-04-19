import React from "react";
import { NavOptions } from "./navoptions";

// `NavBar` component that returns navigation bar component
const NavBar = props =>
	// NavBar contains Search Form<br />
	// NavBar uses NavOptions to add buttons depending upon the current page.<br /><br />
	// Here, `pflg` when set `-1` denotes that the page is either loginPg or searchPg it won't require button to route to `Profile` view or `Logout` button<br />
	// `pflg` set to `1` denotes that the page is proflie view of any user. Only Tweets of that user are to be displayed, hence `DataController` sensor is required to generate Personal Tweet.<br />
	// `pflg` set to `0` shows that the page is dashboard, Toggling between Global Feed and Personal Feed is possible, `ToggleButton` is required.<br /><br />
	// When `query.show` is set to `1` when user switches from profilePg to dashboard to see Global Feed first, `defaultSelected` is `Global` here.<br />
	// `query.show` is set to `0` when user switches from any page to dashboard to see Personal Feed first, `defaultSelected` is `Personal` here.<br />
	(
		<div className="navbar-fixed">
			<nav style={{ color: "black", backgroundColor: "#dadada", height: "60px" }}>
				<div className="nav-wrapper" style={{ margin: "0.4% auto auto auto" }} >
					<div style={{ float: "left", fontSize: "130%", width: "15%", margin: "-0.6% auto 2% 2.5%" }}>
						Twitter on Appbase
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
						query={props.query}
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
