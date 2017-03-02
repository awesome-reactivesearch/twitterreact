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
import {config, onDataTweets, onDataUsers} from './config.js';
const appbaseRef = new Appbase({
	url: config.credential_tweets.url,
	appname: config.credential_tweets.app,
	username: config.credential_tweets.username,
	password: config.credential_tweets.password
});
const date = new Date();

// const uname = 'a'
export const Dashboard = withRouter( 
	React.createClass({

		logOut(event){
			// debugger;
			console.log("logging out!")
			this.props.router.replace('/')
			delete localStorage.user;
		},
		goProfile(event){
			let u = this.props.params.uname;
			this.props.router.replace(`/profile/${u}`)	
		},
		newTweet(event) {
			event.preventDefault()
			console.log('newTweet')
			var msg= document.getElementById('newtweet').value
			// console.log(by)
			appbaseRef.index({
				type: config.credential_tweets.type,
				body: {"by": this.props.params.uname, "createdAt":date.getTime(), "msg":msg}
			}).on('data', function(response) {
				console.log(response);
			}).on('error', function(error) {
				console.log(error);
			});
		},
	 	render() {
			const uStyles = {maxWidth: 400, margin: '30px auto 10px', textAlign:'center', fontSize:'16px'};
			const msgStyles = {maxWidth: 800};
			const s = {margin:'10px auto 10px'}
			const u = this.props.params.uname
			const navStyle = {textAlign:'right',margin: '10px 10px 10px 10px'};
			// debugger;
			const CustomQueryTweets=function(){
					return {
							query: {
								match: {by:u}
							}
						};	
				};
			const CustomQueryUsers=function(){
					return {
							query: {
								match_all: {}
							}
						};	
				};
			// console.log(uname);
			// debugger;
			return (

			<div className ="row" style={s}>
				<div style={navStyle}>
					<button value="Profile" onClick={this.goProfile}>Profile</button>
					<button value="Logout" onClick={this.logOut}>Logout</button>
				</div>
					
		
					<div className="col-xs-2" style={uStyles}>
					<ReactiveBase
						app={config.credential_users.app}
						username= {config.credential_users.username}
						password= {config.credential_users.password}
						type = {config.credential_users.type}
					>
				
					<label>{this.props.params.uname}</label><br/>
					<DataController
						componentId="GetUsers"
						customQuery= {CustomQueryUsers}
						showUI = {false}
					/>
					<ReactiveList
						title="Users"
						componentId="UsersActuator"
						appbaseField="name"
						from={config.ReactiveList.from}
						size={config.ReactiveList.size}
						stream={true}
						requestOnScroll={true}
						onData = {onDataUsers}
						react={{
							'and': ["GetUsers"]
						}}
					/>
					</ReactiveBase>
					</div>
				
				<div className="row">
					<div className="col-xs-4" style={msgStyles}>
					<form id="login" onSubmit={this.newTweet}>
						<div >
						<input type="text" placeholder="Your tweet here..." id="newtweet" />
						<input type="submit" value="Tweet" />
						</div>
					</form>
					</div>
					<div className="col s8 col-xs-8" style={msgStyles}>
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
						title="Tweets"
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
				</div>
			</div>
			
			);
		}
	})
)