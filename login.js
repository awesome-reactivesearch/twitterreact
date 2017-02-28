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



const uStyles = {maxWidth: 400, margin: '10px auto 10px'};
const msgStyles = {maxWidth: 600, margin: '30px auto 50px'};
const wellStyles = {maxWidth: 600, margin: '40px auto 10px'};

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
			const uname = this.refs.username.value
			debugger;
			// this.props.router.replace('user')

			
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
			              <Link to="user">Log out</Link>
					<form  id="login" onSubmit={this.onLogin}>
	            	<div  style={wellStyles}>
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
  	</Router>
), document.getElementById('app'));