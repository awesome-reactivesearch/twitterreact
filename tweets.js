import React, {
	Component
} from 'react';
import {
	ReactiveBase,
	ReactivePaginatedList,
	ReactiveList,
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
		<div key={props.user+"Tweets"}>
	
			<ReactiveList
				componentId="TweetsActuator"
				appbaseField="msg"
				from={config.ReactiveList.from}
				size={config.ReactiveList.size}
				stream={true}
				requestOnScroll={true}
				onData = {onDataTweets}
				sortOptions = {config.tweetsSortOptions}
				react={{
					'and': props.reactOn
				}}
				showResultStats={false}
			/>
			
		</div>
	)
};
module.exports = {
	PersonalTweets
};