import React, { Component } from 'react';
import ReactDom from 'react-dom';
import {Router, Route, Link, browserHistory, withRouter} from 'react-router'
import {
	ReactiveBase,
	ReactiveList,
	DataController,
	TextField,
	ToggleButton
} from '@appbaseio/reactivebase';
import {config,onDataUsers} from './config.js';

const appbaseRef = new Appbase({
	url: config.credential_users.url,
	appname: config.credential_users.app,
	username: config.credential_users.username,
	password: config.credential_users.password
});

export const Profile = withRouter( 
	React.createClass({
		logOut(event){
			// debugger;
			console.log("logging out!")
			this.props.router.replace('/')
			delete localStorage.user;
		},
		goProfile(event){
			let u = localStorage.user;
			this.props.router.replace(`/profile/${u}`)	
		},
		goLocal(event){
			let u = localStorage.user;
			this.props.router.replace(`/${u}`)	
		},
		onDataFollow(response, err){
			let result = null;
			console.log(response)
			if (err){
				console.log(err)
			}
			else if(response) {
				let combineData = response.currentData;

				if(response.mode === 'historic') {
					combineData = response.currentData.concat(response.newData);
				}
				else if(response.mode === 'streaming') {
					console.log('got streaming')
					combineData.unshift(response.newData)
				}
				// console.log(combineData)
				if(combineData){
					var followers = combineData[0]._source.followers
					result = followers.map((markerData, index) => {
						console.log(markerData)
					});
					console.log(followers)
				}
				// if (combineData) {
				// 	result = combineData.map((markerData, index) => {
				// 		let marker = markerData._source;
				// 		// return (<User name={marker.name}/>);
				// 		console.log(markerData)
				// 	});
				// }
				return result;
			}
		},
		render(){
			const navStyle = {textAlign:'right',margin: '10px 10px 10px 10px'};
			const u = this.props.params.uname
			const CustomQuery=function(){
					return {
							query: {
								match: {name:u}
							}
						};	
				};
			// debugger;
			return (

				<ReactiveBase
					app={config.credential_users.app}
					username= {config.credential_users.username}
					password= {config.credential_users.password}
					type = {config.credential_users.type}
				>
				<div className ="row" >
				<div style={navStyle}>
					<button value="GoLocal" onClick={this.goLocal}>Personal Feed</button>
					<button value="Profile" onClick={this.goProfile}>My Profile</button>
					<button value="Logout" onClick={this.logOut}>Logout</button>
				</div>
				<DataController
						componentId="GetUserData"
						customQuery= {CustomQuery}
						showUI = {false}
				/>
				
				<div className="col-xs-2" >
				<label>{this.props.params.uname}</label>
				{(localStorage.user != u)?console.log('not the loggedin user'):console.log('logged user')}
				</div>

				<div className="col s8 col-xs-8">
				<ReactiveList
					title="Followers"
					componentId="FollowersActuator"
					appbaseField="name"
					from={config.ReactiveList.from}
					size={config.ReactiveList.size}
					stream={true}
					requestOnScroll={true}
					onData = {this.onDataFollow}
					react={{
					 'and': ["GetUserData"]
					}}
					  />
				</div>

				<div className="col s8 col-xs-8">
				<ReactiveList
					title="Following"
					componentId="FollowingActuator"
					appbaseField="name"
					from={config.ReactiveList.from}
					size={config.ReactiveList.size}
					stream={true}
					requestOnScroll={true}
					onData = {this.onDataFollow}
					react={{
					 'and': ["GetUserData"]
					}}
					  />
				</div>
			</div>
			</ReactiveBase>
				)
		}
	})
)