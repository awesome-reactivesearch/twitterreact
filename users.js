import React, { Component } from 'react';
import {
	ReactiveBase,
	ReactiveList,
	DataController,
} from '@appbaseio/reactivebase';
import {config, onDataTweets, onDataUsers} from './config.js';

const appbaseRef = new Appbase({
	url: config.credential_userts.url,
	appname: config.credential_userts.app,
	username: config.credential_userts.username,
	password: config.credential_users.password
});
var usr;
const CustomQueryUsers=function(){
		// debugger;
					return {
							query: {
								match: {by:usr}
							}
						};	
				};

const listFollowers = function(user, onDataFollowers){
	// debugger;
	usr=user;
	return (
		<div>
		<ReactiveBase
			app={config.credential_userts.app}
			username= {config.credential_userts.username}
			password= {config.credential_userts.password}
			type = {config.credential_userts.type}
		>
		<DataController
			componentId="GetUser"
			customQuery= {CustomQueryUsers}
			showUI = {false}
		/>
		<ReactiveList
			title= "Followers"
			componentId="FollowersActuators"
			appbaseField="msg"
			from={config.ReactiveList.from}
			size={config.ReactiveList.size}
			stream={true}
			requestOnScroll={true}
			onData = {onDataFollowers}
			react={{
			'and': ["GetUsers"]
			}}
			/>
		</ReactiveBase>
		</div>
		)
}
const listFollowing = function(user, onDataFollowing){
	// debugger;
	usr=user;
	return (
		<div>
		<ReactiveBase
			app={config.credential_userts.app}
			username= {config.credential_userts.username}
			password= {config.credential_userts.password}
			type = {config.credential_userts.type}
		>
		<DataController
			componentId="GetUser"
			customQuery= {CustomQueryUsers}
			showUI = {false}
		/>
		<ReactiveList
			title= "Following"
			componentId="FollowingActuators"
			appbaseField="msg"
			from={config.ReactiveList.from}
			size={config.ReactiveList.size}
			stream={true}
			requestOnScroll={true}
			onData = {onDataFollowing}
			react={{
			'and': ["GetUsers"]
			}}
			/>
		</ReactiveBase>
		</div>
		)
}


module.exports = {
	personalTweets: personalTweets
};