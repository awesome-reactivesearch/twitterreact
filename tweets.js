import React, { Component } from 'react';
import {
	ReactiveBase,
	ReactivePaginatedList,
	DataController,
} from '@appbaseio/reactivebase';
import {config, onDataTweets, onDataUsers} from './config.js';

const appbaseRef = new Appbase({
	url: config.credential_tweets.url,
	appname: config.credential_tweets.app,
	username: config.credential_tweets.username,
	password: config.credential_tweets.password
});
var usr;

const personalTweets = function(user){
	// debugger;
	usr=user;
	return (
		<div className="z-depth-1">
		<ReactiveBase
			app={config.credential_tweets.app}
			username= {config.credential_tweets.username}
			password= {config.credential_tweets.password}
			type = {config.credential_tweets.type}
		>
		<ReactivePaginatedList
			componentId="TweetsActuator"
			appbaseField="msg"
			from={config.ReactiveList.from}
			size={config.ReactiveList.size}
			stream={true}
			requestOnScroll={true}
			onData = {onDataTweets}
			sortOptions = {config.tweetsSortOptions}
			react={{
			'and': ["SearchTweet"]
			}}
			/>
		</ReactiveBase>
		</div>
		)
}

module.exports = {
	personalTweets: personalTweets
};