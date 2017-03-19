import React, { Component } from 'react';
import {
	ReactiveBase,
	ReactivePaginatedList,
	DataController,
	TextField,
	ToggleButton
} from '@appbaseio/reactivebase';
import {config, onDataTweets, onDataUsers} from './config.js';

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
			return(
				<div className="row">
					<div className="col s6">
						<DataController
							componentId="SearchTweet"
							customQuery= {CustomQueryTweets}
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