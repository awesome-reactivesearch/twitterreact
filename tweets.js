import React from "react";
import { ReactiveList } from "@appbaseio/reactivebase";
import {
	config,
	onDataTweets
} from "./config";

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
module.exports = {
	PersonalTweets
};
