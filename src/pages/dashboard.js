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
// `Dashboarad` component to render the dashboard page of app
export default class Dashboard extends Component {
	constructor(props) {
		super(props);
		this.onSearch = this.onSearch.bind(this);
		this.goProfile = this.goProfile.bind(this);
		this.logOut = this.logOut.bind(this);
		this.newTweet = this.newTweet.bind(this);
	}

	// Function called when Search is called
	onSearch(event) {
		event.preventDefault();
		const t = event.target[0].value;
		this.props.router.push(`search/${t}`);
	}

	// on logout pressed to logout the loggedIn user
	logOut(event) {
		event.preventDefault();
		this.props.router.push("/");
		delete localStorage.user;
	}

	// on Profile pressed this function is called to go to loggedIn user profile
	goProfile(event) {
		event.preventDefault();
		const u = this.props.params.uname;
		this.props.router.replace(`/profile/${u}`);
	}

	// when new tweet form is submitted with non-empty string
	newTweet(event) {
		event.preventDefault();
		const msg = event.target[0].value;

		if (msg !== "") {
			appbaseRef.index({
				type: config.credential_tweets.type,
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
	customQueryUsers() {
		return {
			query: {
				match_all: {}
			}
		};
	}

	// `render()` renders the dashboard page with `Navbar` on top and other components like user icons and feed.<br /><br />
	// the flag `pflg` is set to zero and passed to NavBar to get navigation bar for dashboard.<br />
	// Here, `NavBar` component is used to render navigation bar. <br /><br />
	// `DataController` sensor component is used that creates a list of users in app. <br />
	// `ReactiveList` actuator component that reacts on the list of users received by the `GetUsers` DataController sensor. <br /><br />
	//  This componenet includes a form for submiting new tweet. <br />
	// `PersonalTweets` actuator component to render User/Global Tweets that are received from `UserTweet` sensor in `NavBar` component.<br />

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
					query={this.props.location.query}
				/>
				<div className="col s6 m2 offset-s2 offset-m1">
					<ReactiveBase
						app={config.credential_users.app}
						credentials={`${config.credential_tweets.username}:${config.credential_tweets.password}`}
						type={config.credential_users.type}
					>
						<div style={{ height: "25%" }}>
							<div style={{ margin: "0 auto 0 auto" }}>
								<img style={{ height: "65%", padding: "3%", margin: "0 0 0 14%" }} src="user@2x.png" alt="UserImage" />
								<h3 style={{ textAlign: "center", marginTop: "auto" }}>{this.props.params.uname}</h3><br />
							</div>
						</div>
						<DataController
							componentId="GetUsers"
							customQuery={this.customQueryUsers}
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
								requestOnScroll={true}
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
						<input id="inputtweet" type="text accent-2" placeholder="Your tweet here..." style={{ width: "80%", height: "8%", margin: "5% 0 0 0" }} />
						<input type="submit" value="Tweet" className="waves-effect waves-light btn" />
					</form>


					<PersonalTweets
						user={this.props.params.uname}
						reactOn={["UserTweet"]}
					/>

				</div>
			</div>
		);
	}
}

