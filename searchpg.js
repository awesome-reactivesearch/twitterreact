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
		
		CustomQueryTweets(){
			const phrase = this.props.params.txt
			return {
				query: {
					"text" : {
						"message"  :{
							"query": {phrase},
							"type": "phrase"
						}
					}
				}
			}
		},
		render(){
			debugger;
			return(

				<div className="row">
				<NavBar user={this.props.params.uname} logOut={this.logOut} pflg={pflg} onSearch={this.onSearch} goProfile={this.goProfile} />
					<div className="col s6">
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
				</div>
				)
		}
	})
	)