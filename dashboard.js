import React, {
	Component
} from 'react';
import ReactDom from 'react-dom';
import {
	Router,
	Route,
	Link,
	browserHistory,
	withRouter
} from 'react-router'
import {
	ReactiveBase,
	ReactiveList,
	DataController,
	ToggleButton,
	TextField
} from '@appbaseio/reactivebase';
import {
	config,
	onDataTweets,
	onDataUsers
} from './config.js';
import {
	PersonalTweets
} from './tweets.js'
import {
	NavBar
} from './navbar.js'
const appbaseRef = new Appbase({
	url: config.credential_tweets.url,
	appname: config.credential_tweets.app,
	username: config.credential_tweets.username,
	password: config.credential_tweets.password
});
const date = new Date();

// const uname = 'a'
export const Dashboard = withRouter(
	React.createClass({
		// Function called when Search is called
		onSearch(event) {
			event.preventDefault();
			let t = event.target[0].value;
			this.props.router.push(`search/${t}`)
			return;
		},
		// on logout pressed to logout the loggedIn user
		logOut(event) {
			console.log("logging out!")
			this.props.router.push('/')
			delete localStorage.user;
		},
		// on Profile pressed this function is called to go to loggedIn user profile
		goProfile(event) {
			let u = this.props.params.uname;
			this.props.router.replace(`/profile/${u}`)
		},
		// when new tweet form is submitted with non-empty string
		newTweet(event) {
			event.preventDefault()
			console.log('newTweet')
			var msg = this.refs.newtweet.value
			if (msg != "") {
				// new tweet/msg with other details is indexed in the app
				appbaseRef.index({
					type: config.credential_tweets.type,
					body: {
						"by": this.props.params.uname,
						"createdAt": date.getTime(),
						"msg": msg
					}
				}).on('data', function(response) {
					console.log(response);
				}).on('error', function(error) {
					console.log(error);
				});
			}
		},
		// renders the dashboard page with `Navbar` on top and other components like user icons and feed
		render() {
			const u = this.props.params.uname
			//CustomQuery that returns `match_all` query
			const CustomQueryUsers = function() {
				return {
					query: {
						match_all: {}
					}
				};
			};
			// `pflg` set to zero and passed to NavBar to get navigation bar for dashboard
			const pflg = 0;
			return (
				// NavBar component to render navigation bar
				<div className ="row" >
					<NavBar 
						user={this.props.params.uname} 
						logOut={this.logOut} 
						pflg={pflg} 
						onSearch={this.onSearch} 
						goProfile={this.goProfile} 
						query={this.props.location.query}
					/>
					//
					<div className="col s6 m2 offset-s2 offset-m1">
						<ReactiveBase
							app={config.credential_users.app}
							credentials= {`${config.credential_tweets.username}:${config.credential_tweets.password}`}
							type = {config.credential_users.type}
						>
							// Block rendering user image and username
							<div style={{height:'25%'}}>
								<div style={{margin:'0 auto 0 auto'}}>
									<img style={{height:'65%',padding:'3%',margin:'0 0 0 14%'}} src="user@2x.png" />
									<h3 style={{textAlign:'center', marginTop:'auto'}}>{this.props.params.uname}</h3><br/>
								</div>
							</div>
							// `DataController` sensor component that creates a list of users in app 
							<DataController
								componentId="GetUsers"
								customQuery= {CustomQueryUsers}
								showUI = {false}
							/>
							// `ReactiveList` actuator component that reacts on the list of users received by the `GetUsers` DataController sensor
							<div className = "z-depth-1" style={{marginTop:'5%', height:'auto'}}>
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
									showResultStats={false}
								/>
								//
							</div>
						</ReactiveBase>
						
					</div>
					
					<div className="col s8 m6 offset-m1">
							// Form for submiting new tweet
							<form id="newtweet" onSubmit={this.newTweet}>
								<input ref="newtweet" type="text accent-2" placeholder="Your tweet here..." style={{width:'80%',height:'8%',margin:'5% 0 0 0'}}/>
								<input type="submit" value="Tweet" className="waves-effect waves-light btn" />
							</form>
							//
							// `PersonalTweets` actuator component to render User/Global Tweets that are received from `UserTweet` sensor in `NavBar` component
							<PersonalTweets
								user={u}
								reactOn={["UserTweet"]}
							/>
							//
					</div>
				</div>
			);
		}
	})
)