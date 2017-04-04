import React from "react";
import { ReactiveList } from "@appbaseio/reactivebase";
import { config } from "./config";

// on Receiving the tweets
const onDataTweets = function (response, err) {
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
			result = combineData.map((markerData, index) => {
				const marker = markerData._source;
				return (<Tweet msg={marker.msg} usr={marker.by} date={marker.createdAt} />);
			});
		}
	}
	return result;
};


// `PersonalTweets` component to return the `ReactiveList` actuator component that renders tweets
const PersonalTweets = props => (
	<div key={`${props.user}Tweets`}>

		<ReactiveList
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

// Tweet Component
const Tweet = props => (
	<div className="collection">
		<div className="collecton-item">
			<p id="tweet" style={{ margin: "1% 3% 1% 3%" }}>{props.usr}
				<label htmlFor="tweet" style={{ float: "right" }}>
					{new Date(props.date).toDateString()}
				</label>
				<br />
				{props.msg}
			</p>
		</div>
	</div>
		);

module.exports = {
	PersonalTweets,
	onDataTweets,
	Tweet
};
