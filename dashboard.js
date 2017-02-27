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

const uname = 'a'
export const Dashboard = withRouter( 
	React.createClass({
		
		onClick(event){
			console.log("logging out!")
			ReactDom.render(<Login />, document.getElementById('app'));
		},

		newTweet(event) {
			event.preventDefault()
			console.log('newTweet')
			var msg= document.getElementById('newtweet').value
			// console.log(by)
			appbaseRef.index({
			    type: config.credentials.type,
			    body: {"by": uname, "createdAt":date.getTime(), "msg":msg}
			}).on('data', function(response) {
			    console.log(response);
			}).on('error', function(error) {
			    console.log(error);
			});



		},
	 	render() {
			const uStyles = {maxWidth: 400, margin: '30px auto 10px'};
	  		const msgStyles = {maxWidth: 800, margin: '0px auto 10px'};
	  		const s = {margin:'10px auto 10px'}
	  		console.log(uname);
	  		return (
			
				<ReactiveBase
					app={config.credentials.app}
	    			username= {config.credentials.username}
					password= {config.credentials.password}
					type = {config.credentials.type}
				>
				
				<div className ="row" style={s}>
					
						<div className="col-xs-2" style={uStyles}>
						<TextField
	                        title="User"
	                        componentId="UserSensor"
	                        appbaseField="by"
	                        defaultSelected={uname}
	                    />
	                    <button value="Logout" onClick={this.onClick}>Logout</button>
						</div>
					
					<div className="row">
						<div className="col-xs-4" style={msgStyles}>
						<form  id="login" onSubmit={this.newTweet}>
			            	<div >
			                	<input type="text" placeholder="Your tweet here..." id="newtweet" />
			                	<input type="submit" value="Tweet" />
			            	</div>
						</form>
						</div>
						<div className="col s8 col-xs-8" style={msgStyles}>
						<ReactiveList
	                        title="Tweets"
	                        componentId="TweetsActuator"
	                        appbaseField="msg"
	                        from={config.ReactiveList.from}
							size={config.ReactiveList.size}
							stream={true}
	  						requestOnScroll={true}
	  						onData = {onData}
	                        react={{
	                            'and': ["UserSensor"]
	                        }}
	                    />
						</div>
					</div>
				</div>
				</ReactiveBase>
			);
		}
	})
)