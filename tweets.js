import React, {
	Component
} from 'react';
import {
	ReactiveBase,
	ReactivePaginatedList,
	DataController,
} from '@appbaseio/reactivebase';
import {
	config,
	onDataTweets,
	onDataUsers
} from './config.js';
const appbaseRef = new Appbase({
	url: config.credential_tweets.url,
	appname: config.credential_tweets.app,
	username: config.credential_tweets.username,
	password: config.credential_tweets.password
});
var usr;
const PersonalTweets = (props) => {
	// debugger;
	usr = props.user;
	// debugger;
	return (
		<div className="z-depth-1" key={props.user+"Tweets"}>
	
			<ReactivePaginatedList
				componentId={"TweetsActuator"+props.user}
				appbaseField="msg"
				from={config.ReactivePaginatedList.from}
				size={config.ReactivePaginatedList.size}
				stream={true}
				requestOnScroll={true}
				onData = {onDataTweets}
				sortOptions = {config.tweetsSortOptions}
				react={{
				'and': props.reactOn
				}}
			/>
			
		</div>
	)
}
module.exports = {
	PersonalTweets
};