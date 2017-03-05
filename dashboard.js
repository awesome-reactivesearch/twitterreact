import React, { Component } from 'react';
import ReactDom from 'react-dom';
import {Router, Route, Link, browserHistory, withRouter} from 'react-router'
import {
	ReactiveBase,
	ReactiveList,
	DataController,
	TextField
} from '@appbaseio/reactivebase';
import {config, onDataTweets, onDataUsers} from './config.js';
import {personalTweets} from './tweets.js'
const appbaseRef = new Appbase({
	url: config.credential_tweets.url,
	appname: config.credential_tweets.app,
	username: config.credential_tweets.username,
	password: config.credential_tweets.password
});
const date = new Date();
const txtstyle={width:'100%', backgroundColor:'rgba(128, 128, 128, 0.07)'};
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
			var msg= this.refs.newtweet.value
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
			const navStyle = {textAlign:'right',margin: '0px'};
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

			<div className ="row" >
				<nav style={{height:'50px'}} className="z-depth-0">
				<div className="nav-wrapper grey lighten-3">
				<div style={navStyle}>
					<button value="Profile" onClick={this.goProfile} className="waves-effect waves-light btn" >Profile</button>
					<button value="Logout" onClick={this.logOut} className="waves-effect waves-light btn" >Logout</button>
				</div>
				</div>
				</nav>	
		
					<div className="col s2" style={{margin:'0 5% 0 5%'}}>
					<ReactiveBase
						app={config.credential_users.app}
						username= {config.credential_users.username}
						password= {config.credential_users.password}
						type = {config.credential_users.type}
					>
					<img style={{height:'100px', marginLeft:'25%', marginTop:'15%'}} src="user@2x.png" />
					<h3 style={{textAlign:'center', marginTop:'10px'}}>{this.props.params.uname}</h3><br/>
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
					<div className="col s6" style={{margin:'5% 10% 0% 10%'}}>
					<form id="login" onSubmit={this.newTweet}>
						
						<input ref="newtweet" type="text" placeholder="Your tweet here..." style={txtstyle}/>
						<div style={{textAlign:'right'}}>
						<input type="submit" value="Tweet" className="waves-effect waves-light btn"/>
						</div>
						
					</form>
					</div>
					<div className="col s8" style={msgStyles}>
					
			
					{personalTweets(u)}
					</div>
				</div>
			</div>
			
			);
		}
	})
)