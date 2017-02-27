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

import {config, onData} from './config.js';
import {Dashboard} from './dashboard.js'


const date = new Date();
const uStyles = {maxWidth: 400, margin: '10px auto 10px'};
const msgStyles = {maxWidth: 600, margin: '30px auto 50px'};
const wellStyles = {maxWidth: 600, margin: '40px auto 10px'};
const appbaseRef = new Appbase({
  url: config.credentials.url,
  appname: config.credentials.app,
  username: config.credentials.username,
  password: config.credentials.password
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
				app={config.credentials.app}
    			username= {config.credentials.username}
				password= {config.credentials.password}
				type = {config.credentials.type}
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
					onData={onData}
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
			
			event.preventDefault()
			const { location } = this.props

			debugger;
			// this.props.router.replace('user')

			if (location.state ) {
				console.log('oops!')
			}
			else{
				console.log('hey!!')
          		this.props.router.replace('/user')
        	}
		},
		
		render(){
			// debugger;
			const buttonStyles = {width: '60%' , 'marginTop': '3%', 'fontSize': '1.5em'}
			return(
			<div>
					<form  id="login" onSubmit={this.onLogin}>
	            	<div  style={wellStyles}>
	                	<input type="text" placeholder="Name" id="username" style={buttonStyles}/><br/>
	                	<input type="submit" style={buttonStyles} value="login" />
	            	</div>
					</form>

			{get_global}
			</div>
			)
		}
	})
)

// function requireAuth(nextState, replace) {
// 	console.log(nextState)
//   if (true) {
//     replace({
//       pathname: '/',
//       state: { nextPathname: nextState.location.pathname }
//     })
//   }
// }


ReactDom.render((
    <Router history={browserHistory}>
        <Route path="/" component={Login} >
	   			<Route path="user" component={Dashboard} />
      		
    	</Route>
  	</Router>
), document.getElementById('app'));