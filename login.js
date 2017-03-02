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

import {config, onDataTweets} from './config.js';
import {Dashboard} from './dashboard.js'
import {Profile} from './profile.js'


const uStyles = {maxWidth: 400, margin: '10px auto 10px'};
const msgStyles = {maxWidth: 600, margin: '30px auto 50px'};
const wellStyles = {maxWidth: 600, margin: '40px auto 10px'};
const appbaseRef = new Appbase({
	url: config.credential_tweets.url,
	appname: config.credential_tweets.app,
	username: config.credential_tweets.username,
	password: config.credential_tweets.password
});
const CustomQuery= function(){
	return {
			query: {
				match_all: {}
			}
		};	
};

const get_global=(
		
		<ReactiveBase
				app={config.credential_tweets.app}
				username= {config.credential_tweets.username}
				password= {config.credential_tweets.password}
				type = {config.credential_tweets.type}
			>
			
			<DataController
				componentId="GetGlobal"
				customQuery= {CustomQuery}
				showUI = {false}
			/>
			
			<div style={wellStyles}>
				<ReactiveList
					componentId="GlobalTweets"
					appbaseField="msg"
					title="Public Tweets"
					from={config.ReactiveList.from}
					size={config.ReactiveList.size}
					onData={onDataTweets}
					requestOnScroll={true}
					react={{
						'and': ["GetGlobal"]
					}}
				/>
			</div>
		
		</ReactiveBase>
);

var t = true;
var uname = '';


const Login = withRouter(
	React.createClass({
		getInitialState() {
			return {
				error: false
			}
		},

		onLogin(event){
			event.preventDefault();
			const { location } = this.props;
			uname = this.refs.username.value
			// var chk=1;
			appbaseRef.search(
			{
				type: "users",
				body:{
					query: {
						match: {name : uname}
					}
				}
			}).on('data',function(res) {
				var chk = res.hits.total
				// console.log(chk)
				console.log('query result', res.hits.total);
				if (chk == 0) {
					appbaseRef.index(
					{
						type: "users",
						body:{
							"name":uname,
							"followers": [],
							"following":[]
						}
					}).on('data', function(response) {
						console.log(response);
					}).on('error', function(error) {
						console.log(error);
					});
				}
			}).on('error',function(err){
				console.log('search error ',err);
			});
			localStorage.user = uname;
			
			console.log('hey!!')
		this.props.router.replace(`/${uname}`)
		// console.log(this.props.router)
		return;
		},
		
		render(){
			// debugger;
			const buttonStyles = {width: '60%' , 'marginTop': '3%', 'fontSize': '1.5em'}
			return(
			<div>
					<form id="login" onSubmit={this.onLogin}>
			<div style={wellStyles}>
			<input type="text" placeholder="Name" ref="username" style={buttonStyles}/><br/>
			<input type="submit" style={buttonStyles} value="login" />
			</div>
					</form>

			{get_global}
			</div>
			)
		}
	})
)


ReactDom.render((
	<Router history={browserHistory}>
		<Route path="/" component={Login} />
		<Route path=":uname" component={Dashboard} />
		<Route path="profile/:uname" component={Profile} />
	</Router>
), document.getElementById('app'));