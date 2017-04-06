import React from "react";
import {
	ReactiveBase,
	ReactiveList,
	DataController
} from "@appbaseio/reactivebase";
import { Link } from "react-router";
import { config } from "../config/config";

const u = "";
const appbaseRef = new Appbase({
	url: config.credential_users.url,
	appname: config.credential_users.app,
	username: config.credential_users.username,
	password: config.credential_users.password
});
// `ListFollowers` component renders the list of followers
const ListFollowers = (props) => {
	const customQuery = function () {
		return ({
			query: {
				match: {
					name: props.user
				}
			}
		});
	};
	return (
		<div key={`${props.user}Followers`}>
			<ReactiveBase
				app={config.credential_users.app}
				credentials={`${config.credential_tweets.username}:${config.credential_tweets.password}`}
				type={config.credential_users.type}
			>
				<DataController
					componentId={"UserFollowers"}
					customQuery={customQuery}
					showUI={false}
				/>
				<ReactiveList
					title="Followers"
					componentId={"FollowerActuator"}
					appbaseField="followers"
					from={config.ReactiveList.from}
					size={config.ReactiveList.size}
					stream={true}
					requestOnScroll={true}
					onData={props.onDataFollowers}
					react={{
						and: ["UserFollowers"]
					}}
					showResultStats={false}
				/>
			</ReactiveBase>
		</div>
	);
};

// `ListFollowing` component renders the list of following users
const ListFollowing = (props) => {
	const customQuery = function () {
		return ({
			query: {
				match: {
					name: props.user
				}
			}
		});
	};
	return (
		<div key={`${props.user}Following`} >
			<ReactiveBase
				app={config.credential_users.app}
				credentials={`${config.credential_tweets.username}:${config.credential_tweets.password}`}
				type={config.credential_users.type}
			>
				<DataController
					componentId="UserFollowing"
					customQuery={customQuery}
					showUI={false}
				/>
				<ReactiveList
					title="Following"
					componentId={"FollowingActuator"}
					appbaseField="following"
					from={config.ReactiveList.from}
					size={config.ReactiveList.size}
					stream={true}
					requestOnScroll={true}
					onData={props.onDataFollowing}
					react={{
						and: ["UserFollowing"]
					}}
					showResultStats={false}
				/>
			</ReactiveBase>
		</div>
	);
};

// Update users following/followers list, where `follow` bool is `true` when logged user wants to follow the user while `false` when loogged user wants to unfollow the user
const updateUser = function (follow, username) {
	debugger;
	if (username === undefined) {
		username = u;
	}

	const me = localStorage.user;
		// search loggedIn user in app
	appbaseRef.search({
		type: "users",
		body: {
			query: {
				match: {
					name: me
				}
			}
		}
	}).on("data", (res) => {
		const meId = res.hits.hits[0]._id;
		const mefollowing = res.hits.hits[0]._source.following;
		const mefollowers = res.hits.hits[0]._source.followers;

			// if `follow` is true, add user to logged user following list else remove the user from the list
		if (follow) {
			mefollowing.push(username);
		} else {
			const index = mefollowing.indexOf(username);
			mefollowing.splice(index, 1);
		}
		localStorage.ufollowing = mefollowing;
			// Index the updated list to app
		appbaseRef.index({
			type: "users",
			id: meId,
			body: {
				name: me,
				followers: mefollowers,
				following: mefollowing
			}
		}).on("error", (error) => {
			console.error(error);
		});
	}).on("error", (err) => {
		console.error(err);
	});
		// Search for other user in app
	appbaseRef.search({
		type: "users",
		body: {
			query: {
				match: {
					name: username
				}
			}
		}
	}).on("data", (res) => {
		const uId = res.hits.hits[0]._id;
		const ufollowing = res.hits.hits[0]._source.following;
		const ufollowers = res.hits.hits[0]._source.followers;
			// if `follow` is true add logged user to followers list else remove it from the list
		if (follow) {
			ufollowers.push(me);
		} else {
			const index = ufollowers.indexOf(me);
			ufollowers.splice(index, 1);
		}
			// Index the updated entry to the app
		appbaseRef.index({
			type: "users",
			id: uId,
			body: {
				name: username,
				followers: ufollowers,
				following: ufollowing
			}
		}).on("data", function () {
			this.setState({
				nfollowers: ufollowing.length,
				nfollowing: ufollowers.length
			});
		}).on("error", (error) => {
			console.error(error);
		});
	}).on("error", (err) => {
		console.error(err);
	});
};
// on Receiving the user data
const onDataUsers = function (response, err) {
	let result = null;
	if (err) {
		return result;
	}	else if (response) {
		let combineData = response.currentData;
		if (response.mode === "historic") {
			combineData = response.currentData.concat(response.newData);
		}		else if (response.mode === "streaming") {
			combineData.unshift(response.newData);
		}
		if (combineData) {
			result = combineData.map((markerData) => {
				const marker = markerData._source;
				return (<User name={marker.name} />);
			});
		}
	}
	return result;
};

// User Component
const User = props => (
	<div className="collection">
		<div className="collecton-item">
			<p style={{ margin: "1% 2% 1% 2%" }}>
				<Link to={`/profile/${props.name}`}>{props.name}</Link>
			</p>
		</div>
	</div>
		);


module.exports = {
	ListFollowing,
	ListFollowers,
	onDataUsers,
	User,
	updateUser
};