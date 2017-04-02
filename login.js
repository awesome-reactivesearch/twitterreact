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
var flg = 0;
const uStyles = {
	maxWidth: 400,
	margin: '10px auto 10px'
};
const msgStyles = {
	maxWidth: 600,
	margin: '30px auto 50px'
};
const wellStyles = {
	maxWidth: 600,
	margin: '40px auto 10px'
};
const appbaseRef = new Appbase({
	url: config.credential_tweets.url,
	appname: config.credential_tweets.app,
	username: config.credential_tweets.username,
	password: config.credential_tweets.password
});
var t = true;
var uname = '';
var val = '';
const Login = withRouter(
	React.createClass({
		
		CustomQuery(value) {
			// HACK: Check if the value is changed will again mounting the TextField component.
			if (val === value) {
				value = "";
			}
			// debugger;
			if (value === undefined || value === "") {
				// debugger;
				this.txtDefault = ""
				return {
					query: {
						match_all: {}
					}
				};
			} else {
				// debugger;
				val = value;
				return {
					term: {
						msg: value
					}
				};
			}
		},

		onLogin(event) {
			event.preventDefault();
			const { location } = this.props;
			uname = event.target[0].value
			if(uname=="")
				return;
				// var chk=1;
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
					// console.log(chk)
					// console.log('query result', res.hits.total);
					// debugger;
				if (chk != 0) {
					localStorage.ufollowing = (res.hits.hits[0]._source.following)
						// debugger;
				}
				else {
					localStorage.ufollowing = []
				}
				if (chk == 0) {
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
			// console.log('hey!!')
			this.props.router.push({pathname:`/${uname}`, query:{show:0}})
				// console.log(this.props.router)
			return;
		},

		onSearch(event) {
			event.preventDefault();
			let t = event.target[0].value;
			// debugger;
			// console.log('bitch please', t)
			// debugger;
			this.props.router.push(`search/${t}`)
			return;
		},

		render() {
			// debugger;
			flg = 0;
			const txtstyle = {
				width: '85%',
				backgroundColor: '#fafafa',
				margin: '3%',
				fontSize: "20px"
			};
			console.log("STATE", this.txtDefault);
			const pflg=-1;
			return (
				<div>
					<NavBar 
						user={this.props.params.uname} 
						pflg={pflg} 
						onSearch={this.onSearch}
						path={this.props.location.pathname}
						query={{
							'show' : 1
						}
						}
					/>
					<div className="row" >
						<div style={{margin:'2%'}}>
							<LoginForm 
								onLogin= {this.onLogin}
							/>
						</div>
					</div>
					
					<div className="row" style={{margin:'0 10% 0 10%'}}>
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
						</div>
					</div>
					
				</div>
			)
		}
	})
)

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

ReactDom.render((
	<ReactiveBase
		app={config.credential_tweets.app}
		credentials= {`${config.credential_tweets.username}:${config.credential_tweets.password}`}
		type = {config.credential_tweets.type}
	>
		<Router history={browserHistory}>
			<Route path="/" component={Login}/>
			<Route path=":uname" component={Dashboard} onEnter={requireAuth}/>
			<Route path="profile/:uname" component={Profile}  addHandlerKey={true} />
			<Route path="search/:txt" component={SearchPg} />
		</Router>
	</ReactiveBase>
), document.getElementById('app'));