import React, { Component } from 'react';
import {
	ReactiveBase,
	ReactiveList,
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
const CustomQueryTweets=function(){
		// debugger;
					return {
							query: {
								match: {by:usr}
							}
						};	
				};
const personalTweets = function(user){
	// debugger;
	usr=user;
	return (
		<div>
		<ReactiveBase
			app={config.credential_tweets.app}
			username= {config.credential_tweets.username}
			password= {config.credential_tweets.password}
			type = {config.credential_tweets.type}
		>
		<DataController
			componentId="GetTweets"
			customQuery= {CustomQueryTweets}
			showUI = {false}
		/>
		<ReactiveList
			
			componentId="TweetsActuator"
			appbaseField="msg"
			from={config.ReactiveList.from}
			size={config.ReactiveList.size}
			stream={true}
			requestOnScroll={true}
			onData = {onDataTweets}
			react={{
			'and': ["GetTweets"]
			}}
			/>
		</ReactiveBase>
		</div>
		)
}

module.exports = {
	personalTweets: personalTweets
};