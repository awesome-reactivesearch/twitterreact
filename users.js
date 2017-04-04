import React from "react";
import {
	ReactiveBase,
	ReactiveList,
	DataController
} from "@appbaseio/reactivebase";
import { config } from "./config";

//`ListFollowers` component renders the list of followers
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

//`ListFollowing` component renders the list of following users
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
module.exports = {
	ListFollowing,
	ListFollowers
};
