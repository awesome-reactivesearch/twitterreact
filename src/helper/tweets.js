import React from "react";
import { ReactiveList } from "@appbaseio/reactivesearch";
import { Link } from "react-router";
import moment from "moment";
import { config } from "../config/config";

// `PersonalTweets` component to return the `ReactiveList` actuator component that renders tweets
const PersonalTweets = (props) => {
	// on Receiving the tweets
	const onDataTweets = function (markerData) {
		const marker = markerData._source;
		return (<Tweet msg={marker.msg} usr={marker.by} date={marker.createdAt} path={props.path} />);
	};
	return (
		<div key={`${props.user}Tweets`}>

			<ReactiveList
				title="Tweets"
				componentId="TweetsActuator"
				appbaseField="msg"
				from={config.ReactiveList.from}
				size={config.ReactiveList.size}
				stream={true}
				requestOnScroll={true}
				onData={onDataTweets}
				sortOptions={config.tweetsSortOptions}
				react={{
					and: props.reactOn
				}}
				showResultStats={false}
			/>

		</div>
	);
};

// Tweet Component
const Tweet = props => (
	<div className="collection">
		<div className="collecton-item">
			<p id="tweet" style={{ margin: "1% 3% 1% 3%" }}>
				{(props.path === "/") ? (props.usr) : (<Link to={`/profile/${props.usr}`}>{props.usr}</Link>)}
				<label htmlFor="tweet" style={{ float: "right" }}>
					{(new moment(props.date)).fromNow()}
				</label>
				<br />
				{props.msg}
			</p>
		</div>
	</div>
		);

module.exports = {
	PersonalTweets,
	Tweet
};
