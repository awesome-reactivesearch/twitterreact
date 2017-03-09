import React, { Component } from 'react';
import ReactDom from 'react-dom';
import {Router, Route, Link, browserHistory, withRouter} from 'react-router'
import {
	ReactiveBase,
	ReactiveList,
	DataController,
	ReactivePaginatedList,
	TextField,
	ToggleButton
} from '@appbaseio/reactivebase';

import {config, onDataTweets} from './config.js';
import {Dashboard} from './dashboard.js'
import {Profile} from './profile.js'

var flg=0;
const uStyles = {maxWidth: 400, margin: '10px auto 10px'};
const msgStyles = {maxWidth: 600, margin: '30px auto 50px'};
const wellStyles = {maxWidth: 600, margin: '40px auto 10px'};
const appbaseRef = new Appbase({
	url: config.credential_tweets.url,
	appname: config.credential_tweets.app,
	username: config.credential_tweets.username,
	password: config.credential_tweets.password
});
const CustomQuery= function(value){
	// debugger;
	console.log("Default Value:", value);
	if(flg===0){
		value="";
		flg=1;
	}
	// debugger;
	if(value === undefined || value===""){
		// debugger;
		return {
			query: {
				match_all: {}
			}
		};
	}
	else {
		// debugger;
	return {
			match: {msg:value}
		};
	}	
};

var t = true;
var uname = '';


const Login = withRouter(
	React.createClass({
		componentWillMount() {
			this.txtDefault = "";
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
				// console.log('query result', res.hits.total);
				// debugger;

				if (chk!=0){
					localStorage.ufollowing=(res.hits.hits[0]._source.following)
					// debugger;
				}
				else{
					localStorage.ufollowing =[]
				}
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
			
			// console.log('hey!!')
		this.props.router.replace(`/${uname}`)
		// console.log(this.props.router)
		return;
		},
		
		render(){
			// debugger;
			flg=0;
			const txtstyle={width:'85%', backgroundColor:'#fafafa', margin:'3%', fontSize:"20px"};
			console.log("STATE", this.txtDefault);
			return(
			<div>
			<ReactiveBase
				app={config.credential_tweets.app}
				username= {config.credential_tweets.username}
				password= {config.credential_tweets.password}
				type = {config.credential_tweets.type}
			>
			<div className="navbar-fixed">
			<nav style={{color:'black',backgroundColor:'#dadada', height:'60px', position:'fixed'}}>
			<div className="nav-wrapper">
			<div style={{width:'25%', margin:'3px 3px 3px 3px'}}>
				<TextField
					componentId = "SearchTweet"
					appbaseField = "msg"
					placeholder = "Search tweet here..."
					// executeQuery={true}
					defaultSelected = {this.txtDefault}
					customQuery= {CustomQuery}
				/>
			</div>
			</div>
			</nav>
			</div>
			
			<div className="z-depth-1 grey lighten-2" style={{width:'25%',margin:'3% auto 0 auto',textAlign:'center'}}>
			<form id="login" onSubmit={this.onLogin}>
			<div style={{margin:'5%'}}>
			<input type="text blue accent-2" placeholder="Name" ref="username" style={txtstyle}/><br/>
			<input type="submit" style={{width:'85%', margin:'0 0 3% 0',padding:'2px'}} value="Enter your name" className="waves-effect waves-light btn"/>
			</div>
			</form>
			</div>
			
			<div className="row" style={{margin:'0 10% 0 10%'}}>
			<div className="col s10">
				<ReactivePaginatedList
					componentId="GlobalTweets"
					appbaseField="msg"
					title="Public Tweets"
					from={config.ReactivePaginatedList.from}
					size={config.ReactivePaginatedList.size}
					sortOptions = {config.tweetsSortOptions}
					onData={onDataTweets}
					requestOnScroll={true}
					react={{
						'and':['SearchTweet']
					}}
				/>
			</div>
			</div>
			</ReactiveBase>
			</div>
			)
		}
	})
)

function requireAuth(nextState, replace) {
  if (localStorage.user === undefined) {
    replace({
      pathname: '/',
      state: { nextPathname: nextState.location.pathname }
    })
  }
}

function enteringLogin(nextState, replace){

}

ReactDom.render((
	<Router history={browserHistory}>
		<Route path="/" component={Login} onEnter={enteringLogin}/>
		<Route path=":uname" component={Dashboard} onEnter={requireAuth}/>
		<Route path="profile/:uname" component={Profile} />
	</Router>
), document.getElementById('app'));