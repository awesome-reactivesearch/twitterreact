import React, { Component } from 'react';
import {Router, Route, Link, browserHistory, withRouter} from 'react-router'
import {
	ReactiveList,
	ReactiveBase,
	ReactivePaginatedList,
	DataController,
	TextField,
	ToggleButton
} from '@appbaseio/reactivebase';
import {config, onDataTweets, onDataUsers} from './config.js';
import {NavBar} from './navbar.js'
export const SearchPg = withRouter(
	React.createClass({
		onSearch(event){
			event.preventDefault();
			let t = event.target[0].value;
			// debugger;
			// console.log('bitch please', t)
			// debugger;
			this.props.router.replace(`/search/${t}`)
			return;
		},
		CustomQueryTweets(){
			const phrase = this.props.params.txt
			// debugger;
			return {
				query: {
					"match": {
					"msg": phrase
				}
				}
			}
		},
		CustomQueryUsers(){
			const phrase = this.props.params.txt
			// debugger;
			return {
				query: {
					"match": {
					"name": phrase
				}
				}
			}
		},
		render(){
			// debugger;
			const pflg=-1;
			return(

				<div className="row" key={this.props.params.txt}>
					<NavBar 
						user={this.props.params.uname} 
						pflg={pflg} 
						onSearch={this.onSearch}
						path={this.props.location.pathname}
					/>

					<div className="col s4 offset-s1">
						<DataController
							componentId="SearchTweet"
							customQuery= {this.CustomQueryTweets}
							showUI = {false}
						/>
						<ReactiveList
							title="Tweets"
							componentId="TweetsFound"
							appbaseField="msg"
							from={config.ReactiveList.from}
							size={config.ReactiveList.size}
							stream={true}
							requestOnScroll={true}
							onData = {onDataTweets}
							react={{
								'and': ["SearchTweet"]
							}}
						/>
					</div>

					<div className="col s4 offset-s1">
					<ReactiveBase
						app={config.credential_users.app}
						credentials= {`${config.credential_tweets.username}:${config.credential_tweets.password}`}
						type = {config.credential_users.type}
					>
						<DataController
							componentId="SearchUser"
							customQuery= {this.CustomQueryUsers}
							showUI = {false}
						/>
						<ReactiveList
							title="Users"
							componentId="UsersFound"
							appbaseField="name"
							from={config.ReactiveList.from}
							size={config.ReactiveList.size}
							stream={true}
							requestOnScroll={true}
							onData = {onDataUsers}
							react={{
								'and': ["SearchUser"]
							}}
						/>
					</ReactiveBase>
					</div>
				</div>
				)
		}
	})
	)