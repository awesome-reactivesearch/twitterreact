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
	TextField,
	ToggleButton
} from '@appbaseio/reactivebase';
import {
	config,
	onDataUsers,
	User
} from './config.js';
import {
	PersonalTweets
} from './tweets.js'
import {
	ListFollowing,
	ListFollowers
} from './users.js'
import {
	NavBar
} from './navbar.js'
const appbaseRef = new Appbase({
	url: config.credential_users.url,
	appname: config.credential_users.app,
	username: config.credential_users.username,
	password: config.credential_users.password
});
var u = '';
var val = '';
var nfollowers = 0;
var nfollowing = 0;
export const Profile = withRouter(
	React.createClass({
		// on logout pressed this function is called
		logOut(event) {
			console.log("logging out!")
			this.props.router.replace('/')
			delete localStorage.user;
		},
		// on press profile go to present logged user's profile page
		goLocal(event) {
			let u = localStorage.user;
			this.props.router.replace(`/${u}`)
		},
		// on Follow pressed
		followUser(event) {
			this.updateUser(true)
		},
		// on Unfollow pressed
		unfollowUser(event) {
			this.updateUser(false)
		},
		// Update users following/followers list, where `follow` bool is `true` when logged user wants to follow the user while `false` when loogged user wants to unfollow the user
		updateUser(follow, username) {
			if (username === undefined) {
				username = u
			}
			let me = localStorage.user
			console.log('following user')
			// search loggedIn user in app
			appbaseRef.search({
				type: "users",
				body: {
					query: {
						match: {
							name: me
						}
					}
				}
			}).on('data', function(res) {
				console.log(res)
				console.log(res.hits.hits[0]._source)
				var meId = res.hits.hits[0]._id
				var mefollowing = res.hits.hits[0]._source.following
				var mefollowers = res.hits.hits[0]._source.followers
				// if `follow` is true, add user to logged user following list else remove the user from the list
				if (follow) {
					mefollowing.push(username)
				} else {
					var index = mefollowing.indexOf(username)
					mefollowing.splice(index, 1)
				}
				localStorage.ufollowing = mefollowing;
				// Index the updated list to app				
				appbaseRef.index({
					type: "users",
					id: meId,
					body: {
						"name": me,
						"followers": mefollowers,
						"following": mefollowing
					}
				}).on('data', function(response) {
					console.log(response);
				}).on('error', function(error) {
					console.log(error);
				});
			}).on('error', function(err) {
				console.log(err)
			})
			// Search for other user in app
			appbaseRef.search({
				type: "users",
				body: {
					query: {
						match: {
							name: username
						}
					}
				}
			}).on('data', function(res) {
				console.log(res)
				console.log(res.hits.hits[0]._source)
				var uId = res.hits.hits[0]._id
				var ufollowing = res.hits.hits[0]._source.following
				var ufollowers = res.hits.hits[0]._source.followers
				// if `follow` is true add logged user to followers list else remove it from the list
				if (follow) {
					ufollowers.push(me)
				} else {
					var index = ufollowers.indexOf(me)
					ufollowers.splice(index, 1)
				}
				//Index the updated entry to the app
				appbaseRef.index({
					type: "users",
					id: uId,
					body: {
						"name": username,
						"followers": ufollowers,
						"following": ufollowing
					}
				}).on('data', function(response) {
					console.log(response);
					this.setState({
							nfollowers: ufollowing.length,
							nfollowing: ufollowers.length
					})
				}).on('error', function(error) {
					console.log(error);
				});
			}).on('error', function(err) {
				console.log(err)
			})
		},
		// Function called when the `ListFollowers` component gets data
		onDataFollowers(response, err) {
			let result = null;
			console.log(response)
			if (err) {
				console.log(err)
			} else if (response) {
				let combineData = response.currentData;
				if (response.mode === 'historic') {
					combineData = response.currentData.concat(response.newData);
				} else if (response.mode === 'streaming') {
					console.log('got streaming')
					combineData.unshift(response.newData)
				}
				console.log("combineData is:")
				console.log(combineData)
				if (combineData.length != 0) {
					var following = combineData[0]._source.followers
					nfollowing = following.length
					if (following != undefined) {
						result = following.map((markerData, index) => {
							// On every data element return `User` component that *links* to `/profile/:user`
							return (<User name={markerData} />)
						});
					}
				}
				// setState with number of followers, number of following
				this.setState({
					nfollowers: nfollowers,
					nfollowing: nfollowing
				})
				return result;
			}
		},
		// Function called when the `ListFollowing` component gets data
		onDataFollowing(response, err) {
			let result = null;
			console.log(response)
			if (err) {
				console.log(err)
			} else if (response) {
				let combineData = response.currentData;
				if (response.mode === 'historic') {
					combineData = response.currentData.concat(response.newData);
				} else if (response.mode === 'streaming') {
					console.log('got streaming')
					combineData.unshift(response.newData)
				}
				console.log("combineData is:")
				console.log(combineData)
				if (combineData.length != 0) {
					var followers = combineData[0]._source.following
					var name = combineData[0]._source.name
				}
				nfollowers = followers.length
				if (followers != undefined) {
					result = followers.map((markerData, index) => {
						// On every data element return `User` component that *links* to `/profile/:user`
						return (<User name={markerData}/>)
					});
				}
			}
			// setState with number of followers, number of following
			this.setState({
				nfollowers: nfollowers,
				nfollowing: nfollowing
			})
			return result;
		},
		// check if the user is followed by logged user or not
		chkFollowing() {
			u = this.props.params.uname
			let followingList = localStorage.ufollowing
			if (followingList.indexOf(u) == -1) {
				return true;
			}
			return false
		},
		// Initialize state with number of followers=0, number of following=0
		componentWillMount() {
			this.state = {
				nfollowers: 0,
				nfollowing: 0
			}
		},

		// Function called when Search is pressed
		onSearch(event) {
			event.preventDefault();
			let t = event.target[0].value;
			this.props.router.push(`search/${t}`)
			return;
		},
		// on Global pessed function called to switch to logged user dashboard with showing Global tweets
		goGlobalFeed(event){
			event.preventDefault();
			let loggedUser = localStorage.user
			// `show` flag is set to show Global Tweets
			this.props.router.replace({pathname:`/${loggedUser}`, query:{show:1}})
		},
		// on PersonalFeed pessed function called to switch to logged user dashboard with showing Personal Tweets
		goPresonalFeed(event){
			event.preventDefault();
			let loggedUser = localStorage.user
			// `show` flag is clear to show Personal Tweets
			this.props.router.replace({pathname:`/${loggedUser}`, query:{show:0}})
		},

		render() {
			u = this.props.params.uname
			console.log('username now is', u)
			let loggedin = localStorage.user;			
			const msgStyles = {
				maxWidth: 800,
				marginLeft: '10%',
				marginTop: '5%'
			};
			// `pflg` set to `1` i.e flage for navbar for profile page
			const pflg = 1;
			const followbStyle = {
				backgroundColor: '#428bfc',
				color: 'white',
				borderRadius: '3px',
				border: 'none',
				padding: '6%'
			};
			const unfollowbStyle = {
				backgroundColor: '#d2322d',
				color: 'white',
				borderRadius: '3px',
				border: 'none',
				padding: '6%'
			};
			return (
				<div className ="row" >
					// `NavBar` component to render navigation bar for profile page
					<NavBar 
						user={this.props.params.uname}
						logOut={this.logOut}
						pflg={pflg}
						onSearch={this.onSearch}
						goGlobalFeed={this.goGlobalFeed}
						goPresonalFeed={this.goPresonalFeed}
					/>
					// `ListFollowers`, `ListFollowing` components to show list of followers and following respectively
					<div className="col m2 s6 offset-s1 offset-m1" style={{marginTop:'3%'}}>
						<ListFollowers
							user={this.props.params.uname}
							onDataFollowers={this.onDataFollowers}
						/>
						<ListFollowing
							user={this.props.params.uname}
							onDataFollowing={this.onDataFollowing}
						/>

					</div>
					<div className="col s12 m7 l91" style={msgStyles}>
						// Display User image
						<div style={{float:'left', width:'20%'}}>
							<img style={{height:'15%',margin:'15% 10% 15% 15%'}} src="../user@2x.png" />
						</div>
						<div style={{float:'left',width:'80%'}} >
							<div style={{float:'left'}}>
								// Display User name
								<h3 style={{textAlign:'center'}}>{this.props.params.uname}</h3>
							</div>
							// For user that are not logged in show Unfollow button if the logged user follows him else show Follow buton
							// This block will re-render with change in state(i.e change in followers/following number) which will change when logged user tries to follow/unfollow the current user 
							<div style={{width:'100%',float:'left'}} key={this.state}>
								{(localStorage.user != u)?(
								<div className = "col s2"  >
									{this.chkFollowing()?(
									<button value="Follow" style={followbStyle} onClick={this.followUser} >Follow</button>
									):(
									<button value="Unfollow" style={unfollowbStyle} onClick={this.unfollowUser}>Unfollow</button>
									)}
								</div>):(
								<div>
								</div>)}
								// Display number of followers, following
								<div key={this.props.params.uname}>
									<button className="col s4 btn disabled" style={{backgroundColor:'blue',marginLeft:'2%'}}>Followers {this.state.nfollowing}</button>
									<button className="col s4 btn disabled" style={{backgroundColor:'blue'}}>Following {this.state.nfollowers}</button>
								</div>
							</div>
						</div>
						<div className="col s8">
							// `PersonalTweets` actuator component that receives tweets from `UserProfileTweet` DataController sensor in `NavBar`
							<PersonalTweets
								user={u}
								reactOn={["UserProfileTweet"]}
							/>
						</div>
					</div>
				</div>
			)
		}
	})
)