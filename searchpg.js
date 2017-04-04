import React, { Component } from "react";
import {
	ReactiveList,
	ReactiveBase,
	DataController
} from "@appbaseio/reactivebase";
import { config, onDataTweets, onDataUsers } from "./config";
import { NavBar } from "./navbar";

// `SearchPg` component is rendered when user searches for tweets or users
export default class SearchPg extends Component {
	constructor(props) {
		super(props);
		this.onSearch = this.onSearch.bind(this);
		this.CustomQueryTweets = this.CustomQueryTweets.bind(this);
		this.CustomQueryUsers = this.CustomQueryUsers.bind(this);
	}

	// Function is called on pressed search which routess to `/search/:txt`
	onSearch(event) {
		event.preventDefault();
		const t = event.target[0].value;
		this.props.router.replace(`/search/${t}`);
	}

	// `CustomQueryTweets` function to return `match` query for `tweets` type
	CustomQueryTweets() {
		const phrase = this.props.params.txt;
		// `pflg` set to -1 that shows that the current page is searchpage
		return {
			// Here, // NavBar component to render navigation bar
			query: {
				match: {
					msg: phrase
				}
			}
		};
	}

	// `CustomQueryUsers` function to return `match` query for 'users' type
	CustomQueryUsers() {
		const phrase = this.props.params.txt;
		// `pflg` set to -1 that shows that the current page is searchpage
		return {
			// Here, // NavBar component to render navigation bar
			query: {
				match: {
					name: phrase
				}
			}
		};
	}

	// `render()` renders the component with top `NavBar` and `ReactiveList`s for displaying matched tweets and users
	render() {
		// `pflg` set to -1 that shows that the current page is searchpage
		const pflg = -1;
		// Here, `NavBar` component to render navigation bar.
		// `DataController` sensor component that creates a list of tweets/users that matches the searchtext.
		// `ReactiveList` to render tweets/users matched
		return (

			<div className="row" key={this.props.params.txt}>
				<NavBar
					user={this.props.params.uname}
					pflg={pflg}
					onSearch={this.onSearch}
					path={this.props.location.pathname}
				/>

				<div className="col s4 offset-s1">
					<DataController
						componentId="SearchTweet"
						customQuery={this.CustomQueryTweets}
						showUI={false}
					/>
					<ReactiveList
						title="Tweets"
						componentId="TweetsFound"
						appbaseField="msg"
						from={config.ReactiveList.from}
						size={config.ReactiveList.size}
						stream={true}
						requestOnScroll={true}
						onData={onDataTweets}
						react={{
							and: ["SearchTweet"]
						}}
					/>
				</div>

				<div className="col s4 offset-s1">
					<ReactiveBase
						app={config.credential_users.app}
						credentials={`${config.credential_tweets.username}:${config.credential_tweets.password}`}
						type={config.credential_users.type}
					>
						<DataController
							componentId="SearchUser"
							customQuery={this.CustomQueryUsers}
							showUI={false}
						/>
						<ReactiveList
							title="Users"
							componentId="UsersFound"
							appbaseField="name"
							from={config.ReactiveList.from}
							size={config.ReactiveList.size}
							stream={true}
							requestOnScroll={true}
							onData={onDataUsers}
							react={{
								and: ["SearchUser"]
							}}
						/>
					</ReactiveBase>
				</div>
			</div>
		);
	}
	}
