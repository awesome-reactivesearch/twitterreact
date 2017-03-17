import React, { Component } from 'react';
import {
	ReactiveBase,
	ReactiveList,
	DataController,
} from '@appbaseio/reactivebase';
import {config,onDataUsers, User} from './config.js';

const appbaseRef = new Appbase({
	url: config.credential_users.url,
	appname: config.credential_users.app,
	username: config.credential_users.username,
	password: config.credential_users.password
});
var usr;




var listFollowers = function(user, onDataFollowers, followerActuator, getUser){
	
	// usr=user;
	// debugger;
	const customQuery=function(){
		return (
			{
				query: {
					match: {name: user}
				}
			}
			)
	}
	return (
		<div>
		<ReactiveBase
			app={config.credential_users.app}
			credentials= {`${config.credential_tweets.username}:${config.credential_tweets.password}`}
			type = {config.credential_users.type}
		>
		<DataController
		
			componentId={getUser}
			customQuery= {customQuery}
			showUI = {false}
		/>
		<ReactiveList
			title= "Followers"
			componentId={followerActuator}
			appbaseField="followers"
			from={config.ReactiveList.from}
			size={config.ReactiveList.size}
			stream={true}
			requestOnScroll={true}
			onData = {onDataFollowers}
			react={{
				'and': [getUser]
			}}
			/>
		</ReactiveBase>
		</div>
		)
}

var listFollowing = function(user, onDataFollowing, followingActuator, getUser){
	// debugger;
	// usr=user;
	// debugger; 
	const customQuery=function(){
		return (
			{
				query: {
					match: {name: user}
				}
			}
			)
	}
	return (
		<div>
		<ReactiveBase
			app={config.credential_users.app}
			credentials= {`${config.credential_tweets.username}:${config.credential_tweets.password}`}
			type = {config.credential_users.type}
		>
		<DataController
			componentId={getUser}
			customQuery= {customQuery}
			showUI = {false}
		/>
		<ReactiveList
			title= "Following"
			componentId={followingActuator}
			appbaseField="following"
			from={config.ReactiveList.from}
			size={config.ReactiveList.size}
			stream={true}
			requestOnScroll={true}
			onData = {onDataFollowing}
			react={{
				'and': [getUser]
			}}
			/>
		</ReactiveBase>
		</div>
		)
};


module.exports = {
	listFollowing: listFollowing,
	listFollowers: listFollowers
};