import React, { Component } from "react";
import {
	ReactiveBase,
	ReactiveList,
	DataController
} from "@appbaseio/reactivesearch";
import { config, appbaseRef } from "../config/config";
import { PersonalTweets } from "../helper/tweets";
import { NavBar } from "../nav/navbar";
import { onDataUsers } from "../helper/users";

const date = new Date();
// `Dashboard` component to render the dashboard page of app
export default class Dashboard extends Component {
	constructor(props) {
		super(props);
		this.onSearch = this.onSearch.bind(this);
		this.goProfile = this.goProfile.bind(this);
		this.logOut = this.logOut.bind(this);
		this.newTweet = this.newTweet.bind(this);
		this.goGlobalFeed = this.goGlobalFeed.bind(this);
		this.goPresonalFeed = this.goPresonalFeed.bind(this);
		this.CustomQuerytweets = this.CustomQuerytweets.bind(this);
		if (this.props.location.query) {
			if (this.props.location.query.show == 1) {
				this.state = { show: "Global" };
			}
		}
		this.state = { show: "Perosnal" };
	}

	// Function called when search is called
	onSearch(event) {
		event.preventDefault();
		const t = event.target[0].value;
		this.props.router.push(`/search/${t}`);
	}

	// on `Logout` button press, remove user session from localStorage and route to home
	logOut(event) {
		event.preventDefault();
		this.props.router.push("/");
		delete localStorage.user;
	}

	// on `Profile` button press, go to logged in user's profile
	goProfile(event) {
		event.preventDefault();
		const u = this.props.params.uname;
		this.props.router.replace(`/profile/${u}`);
	}

	// set background color button
	setBgCOlor(active, inactive) {
		const b = document.getElementById(active);
		b.className = "waves-effect waves-light btn";
		const p = document.getElementById(inactive);
		p.className = "waves-effect waves-light grey lighten-4 btn";
	}

	// on `Global` button pess, switch to logged in user's dashboard with a view showing global tweets
	goGlobalFeed(event) {
		event.preventDefault();
		this.setBgCOlor("globalButton", "personalButton");
		this.setState({ show: "Global" });
	}

	// on `Personal` button press, switch to logged in user's dashboard with a view showing personal tweets
	goPresonalFeed(event) {
		event.preventDefault();
		this.setBgCOlor("personalButton", "globalButton");
		this.setState({ show: "Personal" });
	}

	// indexes data into appbase.io app when a user tweets
	newTweet(event) {
		event.preventDefault();
		const msg = event.target[0].value.trim();

		if (msg !== "") {
			appbaseRef.index({
				type: "tweets",
				body: {
					by: this.props.params.uname,
					createdAt: date.getTime(),
					msg
				}
			});
			document.getElementById("inputtweet").value = "";
		}
	}

	// CustomQuery that returns `match_all` query
	customQueryGlobal() {
		return {
			query: {
				match_all: {}
			}
		};
	}

	CustomQuerytweets() {
		if (this.props.location.query) {
			if (this.props.location.query.show == 1) {
				this.setBgCOlor("globalButton", "personalButton");
				this.props.location.query = null;
				this.setState({ show: "Global" });
			}			else if (this.props.location.query.show == 0) {
				this.setBgCOlor("personalButton", "globalButton");
				this.props.location.query = null;
				this.setState({ show: "Personal" });
			}
		}

		if (this.state.show === "Global") {
			return {
				query: {
					match_all: {}
				}
			};
		}

		return {
			query: {
				match: {
					by: this.props.params.uname
				}
			}
		};
	}

	// `render()` renders the dashboard page with `Navbar` on top and other components like user icons and feed.<br /><br />
	// the flag `pflg` is set to `1` and passed to NavBar to get navigation bar for dashboard.<br />
	// Here, `NavBar` component is used to render navigation bar. <br /><br />
	// `DataController` sensor component is used that creates a list of users in app. <br />
	// `ReactiveList` actuator component that reacts on the list of users received by the `GetUsers` DataController sensor. <br /><br />
	//  This componenet includes a form for submiting new tweet. <br />
	// `PersonalTweets` actuator component to render User/Global Tweets that are received from `DashboardTweet` DataController sensor.<br />
	render() {
		const pflg = 0;
		return (
			<div className="row" >
				<NavBar
					user={this.props.params.uname}
					logOut={this.logOut}
					pflg={pflg}
					onSearch={this.onSearch}
					goProfile={this.goProfile}
					goGlobalFeed={this.goGlobalFeed}
					goPresonalFeed={this.goPresonalFeed}
					query={this.props.location.query}
				/>
				<div className="col s6 m2 offset-s2 offset-m1">
					<ReactiveBase
						app={config.credential_appbase.app}
						credentials={config.credential_appbase.credentials}
						type="users"
					>
						<div style={{ height: "25%" }}>
							<div style={{ margin: "0 auto 0 auto" }}>
								<img style={{ height: "100px", padding: "3%", margin: "0 0 0 25%" }} src="/user@2x.png" alt="UserImage" />
								<h3 style={{ textAlign: "center", marginTop: "auto" }}>{this.props.params.uname}</h3><br />
							</div>
						</div>
						<DataController
							componentId="GetUsers"
							customQuery={this.customQueryGlobal}
							showUI={false}
						/>
						<div className="z-depth-1" style={{ marginTop: "5%", height: "auto" }}>
							<ReactiveList
								title="Users"
								componentId="UsersActuator"
								appbaseField="name"
								from={config.ReactiveList.from}
								size={config.ReactiveList.size}
								stream={true}
								onData={onDataUsers}
								react={{
									and: ["GetUsers"]
								}}
								showResultStats={false}
							/>
						</div>
					</ReactiveBase>

				</div>

				<div className="col s8 m6 offset-m1">
					<form id="newtweet" onSubmit={this.newTweet}>
						<input id="inputtweet" type="text accent-2" placeholder="Your tweet here..." style={{ width: "80%", height: "45px", margin: "5% 0 0 0" }} />
						<input type="submit" value="Tweet" className="waves-effect waves-light btn" />
					</form>
					<DataController
						componentId={"DashboardTweet"}
						defaultSelected={this.state.show}
						customQuery={this.CustomQuerytweets}
						showUI={false}
					/>
					<div>
						<PersonalTweets
							user={this.props.params.uname + this.state.show}
							reactOn={["DashboardTweet"]}
						/>
					</div>
				</div>
			</div>
		);
	}
}

