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
import {config} from './config.js';

const appbaseRef = new Appbase({
  url: config.credential_users.url,
  appname: config.credential_users.app,
  username: config.credential_users.username,
  password: config.credential_users.password
});

export const Dashboard = withRouter( 
	React.createClass({
		const onDataFollowers =function(){
			return(
				<div>
					Username
				</div>
			)
		},

		const onDataFollowing =function(){
			return(
				<div>
					Username
				</div>
				)
		},
		render(){
			const CustomQuery=function(){
				const u = this.props.params.uname
					return {
							query: {
								match: {name:u}
							}
						};	
				};
			
			return (
				<ReactiveBase
					app={config.credential_users.app}
	    			username= {config.credential_users.username}
					password= {config.credential_users.password}
					type = {config.credential_users.type}
				>
				<div className ="row" style={s}>
					<DataController
							componentId="GetUserData"
							customQuery= {CustomQuery}
							showUI = {false}
					/>
					
					<div className="col-xs-2" style={uStyles}>
					<label>{this.props.params.uname}</label>
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
  						onData = {onDataFollowers}
                        react={{
                            'and': ["GetUserData"]
                        }}
                    />
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
  						onData = {onDataFolloweing}
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