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
import {config,onDataUsers, User} from './config.js';

const appbaseRef = new Appbase({
	url: config.credential_users.url,
	appname: config.credential_users.app,
	username: config.credential_users.username,
	password: config.credential_users.password
});
var u = ''

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

		followUser(event){
			let me = localStorage.user
			console.log('following user')
			appbaseRef.search(
			{
				type: "users",
				body:{
					query: {
						match: {name : me}
					}
				}
			}).on('data', function(res){
				console.log(res)
				console.log(res.hits.hits[0]._source)
				var meId = res.hits.hits[0]._id
				var mefollowing = res.hits.hits[0]._source.following
				var mefollowers = res.hits.hits[0]._source.followers
				mefollowing.push(u)
				// debugger;
				appbaseRef.index(
					{
					type: "users",
					id: meId,
					body:{
						"name":me,
						"followers": mefollowers,
						"following":mefollowing
					}
					}).on('data', function(response) {
						console.log(response);
					}).on('error', function(error) {
						console.log(error);
					});
			}).on('error', function(err){
				console.log(err)
			})

			appbaseRef.search(
			{
				type: "users",
				body:{
					query: {
						match: {name : u}
					}
				}
			}).on('data', function(res){
				console.log(res)
				console.log(res.hits.hits[0]._source)
				var uId = res.hits.hits[0]._id
				var ufollowing = res.hits.hits[0]._source.following
				var ufollowers = res.hits.hits[0]._source.followers
				ufollowers.push(me)
				// debugger;
				appbaseRef.index(
					{
					type: "users",
					id: uId,
					body:{
						"name":u,
						"followers": ufollowers,
						"following":ufollowing
					}
					}).on('data', function(response) {
						console.log(response);
					}).on('error', function(error) {
						console.log(error);
					});
			}).on('error', function(err){
				console.log(err)
			})
		},

		onDataFollowing(response, err){
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
				console.log("combineData is:")
				console.log(combineData)
				if(combineData){
					var following = combineData[0]._source.following
					result = following.map((markerData, index) => {
						return (<User name={markerData} />)	
					});
					
				}
				debugger;
				return result;
			}
		},

		onDataFollowers(response, err){
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
				console.log("combineData is:")
				console.log(combineData)
				if(combineData){
					var followers = combineData[0]._source.followers
					result = followers.map((markerData, index) => {
						return (<User name={markerData} />)	
					});
					
				}
				
				return result;
			}
		},

		render(){
			const navStyle = {textAlign:'right',margin: '10px 10px 10px 10px'};
			u = this.props.params.uname
			let loggedin = localStorage.user;
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
					
					<button value="Logout" onClick={this.logOut}>Logout</button>
				</div>
				<DataController
						componentId="GetUserData"
						customQuery= {CustomQuery}
						showUI = {false}
				/>
				
				<div className="col-xs-2" >
				<label>{this.props.params.uname}</label>
				{(localStorage.user != u)?(
					<div>
					<button value="Follow" onClick={this.followUser}>Follow</button>
					</div>):console.log('logged user')}
				</div>

				<div className="col-xs-4">
				<ReactiveList
					title="Followers"
					componentId="FollowersActuator"
					appbaseField="followers"
					from={config.ReactiveList.from}
					size={config.ReactiveList.size}
					stream={true}
					requestOnScroll={true}
					onData = {this.onDataFollowers}
					react={{
					 'and': ["GetUserData"]
					}}
					  />
				</div>

				<div className="col-xs-4">

				<ReactiveList
					title="Following"
					componentId="FollowingActuator"
					appbaseField="following"
					from={config.ReactiveList.from}
					size={config.ReactiveList.size}
					stream={true}
					requestOnScroll={true}
					onData = {this.onDataFollowing}
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