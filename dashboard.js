import React, { Component } from 'react';
import ReactDom from 'react-dom';
import {Router, Route, Link, browserHistory, withRouter} from 'react-router'
import {
	ReactiveBase,
	ReactiveList,
	DataController,
	ToggleButton,
	TextField
} from '@appbaseio/reactivebase';
import {config, onDataTweets, onDataUsers} from './config.js';
import {personalTweets} from './tweets.js'
import {navBar} from './navbar.js'
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
		componentWillMount() {
			this.txtDefault = "";
		},
		logOut(event){
			// debugger;
			console.log("logging out!")
			this.props.router.push('/')
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
			// debugger;
			if(msg!=""){
				// console.log(by)
				appbaseRef.index({
					type: config.credential_tweets.type,
					body: {"by": this.props.params.uname, "createdAt":date.getTime(), "msg":msg}
				}).on('data', function(response) {
					console.log(response);
				}).on('error', function(error) {
					console.log(error);
				});
			}
		},
		
	 	render() {
			const uStyles = {maxWidth: 400, margin: '30px auto 10px', textAlign:'center', fontSize:'16px'};
			const msgStyles = {maxWidth: 800};
			const s = {margin:'10px auto 10px'}
			const u = this.props.params.uname
			
			// debugger;
			
			const CustomQueryUsers=function(){
					return {
							query: {
								match_all: {}
							}
						};	
				};
			
			// console.log(uname);
			// debugger;
			const pflg = 0;
			return (

			<div className ="row" >
				{navBar(this.props.params.uname, this.goProfile, this.logOut,pflg)}
					<div className="col s2" style={{margin:'auto 5% 0 2%'}}>
					<ReactiveBase
						app={config.credential_users.app}
						credentials= {`${config.credential_tweets.username}:${config.credential_tweets.password}`}
						type = {config.credential_users.type}
					>
					<div style={{height:'25%'}}>
					<div style={{margin:'0 auto 0 auto'}}>
					<img style={{height:'65%',padding:'3%',margin:'0 0 0 14%'}} src="user@2x.png" />
					<h3 style={{textAlign:'center', marginTop:'auto'}}>{this.props.params.uname}</h3><br/>
					</div>
					</div>
					<DataController
						componentId="GetUsers"
						customQuery= {CustomQueryUsers}
						showUI = {false}
					/>
					<div className = "z-depth-1" style={{marginTop:'5%'}}>
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
					</div>
					</ReactiveBase>
					
					</div>
				
				<div className="row">
					<div className="col s6" style={{margin:'3% 10% 0% 5%'}}>
					<form id="login" onSubmit={this.newTweet}>
						
						<input ref="newtweet" type="text" placeholder="Your tweet here..." style={txtstyle}/>
						<div style={{textAlign:'right'}}>
						<input type="submit" value="Tweet" className="waves-effect waves-light btn"/>
						</div>
						
					</form>
					</div>
					<div className="col s6 z-depth-1">
					
			
					{personalTweets(u,["SwitchMyTweet"+u,"SearchMyTweet"+u])}
					</div>
				</div>
			</div>
			
			);
		}
	})
)