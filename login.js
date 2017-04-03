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
	ReactivePaginatedList,
	TextField,
	ToggleButton
} from '@appbaseio/reactivebase';
import {
	config,
	onDataTweets,
	LoginForm
} from './config.js';
import {
	Dashboard
} from './dashboard.js'
import {
	Profile
} from './profile.js'
import {
	SearchPg
} from './searchpg.js'
import {NavBar} from './navbar.js'

require("@appbaseio/reactivebase/dist/css/style.min.css");

const appbaseRef = new Appbase({
	url: config.credential_tweets.url,
	appname: config.credential_tweets.app,
	username: config.credential_tweets.username,
	password: config.credential_tweets.password
});
var uname = '';

// `Login` react class with higher-order component `withRouter` of 'react-router', this is Home view of App
const Login = withRouter(
	React.createClass({
		// Function called when user submits Login form
		onLogin(event) {
			event.preventDefault();
			const { location } = this.props;
			uname = event.target[0].value
			// For null inputs stay on same page
			if(uname=="")
				return;
			// Search if the username typed exists
			appbaseRef.search({
				type: "users",
				body: {
					query: {
						match: {
							name: uname
						}
					}
				}
			}).on('data', function(res) {
				var chk = res.hits.total
				if (chk != 0) {
					// If exists store userfollowing data in localStorage
					localStorage.ufollowing = (res.hits.hits[0]._source.following)
				}
				else {
					localStorage.ufollowing = []
				}
				if (chk == 0) {
					// For new user who is not in app index his details.
					appbaseRef.index({
						type: "users",
						body: {
							"name": uname,
							"followers": [],
							"following": []
						}
					}).on('data', function(response) {
						console.log(response);
					}).on('error', function(error) {
						console.log(error);
					});
				}
			}).on('error', function(err) {
				console.log('search error ', err);
			});
			localStorage.user = uname;
			// Move on /:uname page
			this.props.router.push({pathname:`/${uname}`, query:{show:0}})
			return;
		},

		// Function called when Search is called
		onSearch(event) {
			event.preventDefault();
			let searchtxt = event.target[0].value;
			// Move on /search/:searchtxt 
			this.props.router.push(`search/${searchtxt}`)
			return;
		},
		// renders Login component with `NavBar` on top and `LoginForm` and `GlobalTweets` below
		render() {
			// `pflg` flag sent to NavBar to get navigation bar of homepg
			const pflg=-1;
			return (
				//
				<div>
					<NavBar 
						user={this.props.params.uname} 
						pflg={pflg} 
						onSearch={this.onSearch}
						path={this.props.location.pathname}
						query={{
							'show' : 1
						}}
					/>
					//
					<div className="row" >
					// `LoginForm` to render Login form
						<div style={{margin:'2%'}}>
							
							<LoginForm 
								onLogin= {this.onLogin}
							/>
							//
						</div>
					</div>
					//					
					<div className="row" style={{margin:'0 10% 0 10%'}}>
					// `ReactiveList` to render tweets
						<div className="col s10 offset-s1">
							<ReactiveList
								componentId="GlobalTweets"
								appbaseField="msg"
								title="Public Tweets"
								from={config.ReactivePaginatedList.from}
								size={config.ReactivePaginatedList.size}
								sortOptions = {config.tweetsSortOptions}
								onData={onDataTweets}
								requestOnScroll={true}
								react={{
									'and':['GlobalTweet']
								}}
								stream = {true}
							/>
							//
						</div>
					</div>
				</div>
				//
			)
		}
	})
)
// check if Loggedin user details are stored in localStorage before entering the `/:uname` page.
function requireAuth(nextState, replace) {
	if (localStorage.user === undefined) {
		replace({
			pathname: '/',
			state: {
				nextPathname: nextState.location.pathname
			}
		})
	}
}
// Render Router elements into the DOM
ReactDom.render((
	// Router Component
	<ReactiveBase
		app={config.credential_tweets.app}
		credentials= {`${config.credential_tweets.username}:${config.credential_tweets.password}`}
		type = {config.credential_tweets.type}
	>
	
		<Router history={browserHistory}>
		//
			<Route path="/" component={Login}/>
			<Route path=":uname" component={Dashboard} onEnter={requireAuth}/>
			<Route path="profile/:uname" component={Profile}  addHandlerKey={true} />
			<Route path="search/:txt" component={SearchPg} />
		</Router>
	</ReactiveBase>
	//
), document.getElementById('app'));