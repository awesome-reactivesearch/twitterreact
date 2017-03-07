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




var listFollowers = function(user, onDataFollowers){
	
	usr=user;
	// var CustomQueryUsers=function(){
	// 	// debugger;
	// 				return {
	// 						query: {
	// 							match: {name:usr}
	// 						}
	// 					};	
	// 			};
	debugger;
	return (
		<div>
		<ReactiveBase
			app={config.credential_users.app}
			username= {config.credential_users.username}
			password= {config.credential_users.password}
			type = {config.credential_users.type}
		>
		<DataController
		
			componentId="GetUser"
			customQuery= {()=>({
							query: {
								match: {name:user}
							}
						})}
			showUI = {false}
		/>
		<ReactiveList
			title= "Followers"
			componentId="FollowersActuators"
			appbaseField="followers"
			from={config.ReactiveList.from}
			size={config.ReactiveList.size}
			stream={true}
			requestOnScroll={true}
			onData = {onDataFollowers}
			react={{
				'and': ["GetUser"]
			}}
			/>
		</ReactiveBase>
		</div>
		)
}

var listFollowing = function(user, onDataFollowing){
	// debugger;
	usr=user;

	return (
		<div>
		<ReactiveBase
			app={config.credential_users.app}
			username= {config.credential_users.username}
			password= {config.credential_users.password}
			type = {config.credential_users.type}
		>
		<DataController
			componentId="GetUser"
			customQuery= {()=>({
							query: {
								match: {name:user}
							}
						})}
			showUI = {false}
		/>
		<ReactiveList
			title= "Following"
			componentId="FollowingActuators"
			appbaseField="following"
			from={config.ReactiveList.from}
			size={config.ReactiveList.size}
			stream={true}
			requestOnScroll={true}
			onData = {onDataFollowing}
			react={{
				'and': ["GetUser"]
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