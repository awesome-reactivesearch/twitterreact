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
// `SearchPg` component is rendered when user searches for tweets or users
export const SearchPg = withRouter(
	React.createClass({
		// Function is called on pressed search which routess to `/search/:txt`
		onSearch(event){
			event.preventDefault();
			let t = event.target[0].value;
			this.props.router.replace(`/search/${t}`)
			return;
		},
		// `CustomQueryTweets` function to return `match` query for `tweets` type
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
		// `CustomQueryUsers` function to return `match` query for 'users' type
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
		// renders the component with top `NavBar` and `ReactiveList`s for displaying matched tweets and users
		render(){
			// `pflg` set to -1 that shows that the current page is searchpage
			const pflg=-1;
			return(

				<div className="row" key={this.props.params.txt}>
				// NavBar component to render navigation bar
					<NavBar 
						user={this.props.params.uname} 
						pflg={pflg} 
						onSearch={this.onSearch}
						path={this.props.location.pathname}
					/>

					<div className="col s4 offset-s1">
					// `DataController` sensor component that creates a list of tweets that matches the searchtext 
						<DataController
							componentId="SearchTweet"
							customQuery= {this.CustomQueryTweets}
							showUI = {false}
						/>
						// `ReactiveList` to render tweets
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
					// `DataController` sensor component that creates a list of user that matches the searchtext 
						<DataController
							componentId="SearchUser"
							customQuery= {this.CustomQueryUsers}
							showUI = {false}
						/>
						// `ReactiveList` to render user list
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