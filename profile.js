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
import {config,onDataUsers, User} from './config.js';
import {personalTweets} from './tweets.js'
import {listFollowing, listFollowers} from './users.js'
import {navBar} from './navbar.js'
const appbaseRef = new Appbase({
	url: config.credential_users.url,
	appname: config.credential_users.app,
	username: config.credential_users.username,
	password: config.credential_users.password
});
var u = '';
var val='';
var nfollowers = 0;
var nfollowing = 0;
export const Profile = withRouter( 
	React.createClass({
		
		logOut(event){
			// debugger;
			console.log("logging out!")
			this.props.router.replace('/')
			delete localStorage.user;
		},

		goProfile(event){
			let u = localStorage.user;
			this.props.router.replace(`/profile/${u}`)	
		},

		goLocal(event){
			let u = localStorage.user;
			this.props.router.replace(`/${u}`)	
		},

		followUser(event){
			this.updateUser(true)
		},
		unfollowUser(event){
			this.updateUser(false)
		},
		updateUser(follow, username){
			
			if(username===undefined){
				username = u
			}
			// debugger;
			let me = localStorage.user
			console.log('following user')
			appbaseRef.search(
			{
				type: "users",
				body:{
					query: {
						match: {name : me}
					}
				}
			}).on('data', function(res){
				console.log(res)
				console.log(res.hits.hits[0]._source)
				var meId = res.hits.hits[0]._id
				var mefollowing = res.hits.hits[0]._source.following
				var mefollowers = res.hits.hits[0]._source.followers
				// debugger;
				if(follow){
					mefollowing.push(username)
				}
				else{
					var index = mefollowing.indexOf(username)
					mefollowing.splice(index,1)
					// debugger;
				}
				localStorage.ufollowing = mefollowing;
				// debugger;
				appbaseRef.index(
					{
					type: "users",
					id: meId,
					body:{
						"name":me,
						"followers": mefollowers,
						"following":mefollowing
					}
					}).on('data', function(response) {
						console.log(response);
					}).on('error', function(error) {
						console.log(error);
					});
			}).on('error', function(err){
				console.log(err)
			})

			appbaseRef.search(
			{
				type: "users",
				body:{
					query: {
						match: {name : username}
					}
				}
			}).on('data', function(res){
				console.log(res)
				console.log(res.hits.hits[0]._source)
				var uId = res.hits.hits[0]._id
				var ufollowing = res.hits.hits[0]._source.following
				var ufollowers = res.hits.hits[0]._source.followers
				if(follow){
					ufollowers.push(me)
					// debugger;
				}
				else{
					var index = ufollowers.indexOf(me)
					ufollowers.splice(index,1)
					// debugger;
				}
				// debugger;
				appbaseRef.index(
					{
					type: "users",
					id: uId,
					body:{
						"name":username,
						"followers": ufollowers,
						"following":ufollowing
					}
					}).on('data', function(response) {
						console.log(response);
						
					}).on('error', function(error) {
						console.log(error);
					});
			}).on('error', function(err){
				console.log(err)
			})
		},

		onDataFollowers(response, err){
			let result = null;
			console.log(response)
			if (err){
				console.log(err)
			}
			else if(response) {
				let combineData = response.currentData;

				if(response.mode === 'historic') {
					combineData = response.currentData.concat(response.newData);
				}
				else if(response.mode === 'streaming') {
					console.log('got streaming')
					combineData.unshift(response.newData)
				}
				console.log("combineData is:")
				console.log(combineData)
				if(combineData.length!=0){
					var following = combineData[0]._source.followers
					nfollowing = following.length
					if(following!=undefined){
						result = following.map((markerData, index) => {
							return (<User name={markerData} />)	
						});
					}
				}
				// debugger;
				this.setState({nfollowers:nfollowers, nfollowing:nfollowing})
				return result;
			}
		},

		onDataFollowing(response, err){
			let result = null;
			
			console.log(response)
			if (err){
				console.log(err)
			}
			else if(response) {
				let combineData = response.currentData;

				if(response.mode === 'historic') {
					combineData = response.currentData.concat(response.newData);
				}
				else if(response.mode === 'streaming') {
					console.log('got streaming')
					combineData.unshift(response.newData)
				}
				console.log("combineData is:")
				console.log(combineData)
				if(combineData.length!=0){
					var followers = combineData[0]._source.following
					var name = combineData[0]._source.name
					var unfollowflg=false
					if(name == localStorage.user)
						unfollowflg=true;
					}
					nfollowers = followers.length
					
					if(followers!=undefined){
						result = followers.map((markerData, index) => {
							return (<User name={markerData} unfollowflg={unfollowflg} onunfollowClick={this.updateUser}/>)	
						});

					}	
					
				}
				this.setState({nfollowers:nfollowers, nfollowing:nfollowing})
				return result;
			},

		chkFollowing(){
			u = this.props.params.uname
			let followingList = localStorage.ufollowing
			// debugger;
			// console.log(followingList.indexOf(u))
			if (followingList.indexOf(u) == -1){
				return true;
			}
			return false
		},
		tryMe(){
			return !this.state.b
		},
		getComponents(nextState, callback){
			console.log("woah!!")
		},
		componentDidUpdate(prevProps, prevState) {
			console.log("wohooo!!")
		},
		
		componentWillMount() {
			console.log('hey11!')
			this.state = {nfollowers:0, nfollowing:0}
		},
		render(){
			u = this.props.params.uname
			console.log('username now is', u)

			let loggedin = localStorage.user;
			let getUser = "GetUser" + u;
			let followerActuator = "FollowerActuator"+u;
			let followingActuator = "FollowingActuator"+u;
			// debugger;
			const msgStyles = {maxWidth: 800, marginLeft:'10%', marginTop:'5%'};
			// debugger;
			const pflg = 1;
			const followbStyle= {backgroundColor:'#428bfc', color:'white', borderRadius:'3px', border:'none',padding:'6%'};
			const unfollowbStyle= {backgroundColor:'#d2322d', color:'white', borderRadius:'3px', border:'none',padding:'6%'};
			return (
				
			
			<div className ="row" >
				{navBar(this.props.params.uname, this.goLocal, this.logOut, pflg)}
					
					<div className="col s12 m2 l2" style={{marginTop:'3%'}}>
						{listFollowers(this.props.params.uname,this.onDataFollowers,followerActuator,getUser)}
						
						{listFollowing(this.props.params.uname,this.onDataFollowing,followingActuator,getUser)}
						
					</div>
					<div className="col s12 m8 l91" style={msgStyles}>
						<div style={{float:'left', width:'20%'}}>
							<img style={{height:'15%',margin:'15% 10% 15% 15%'}} src="../user@2x.png" />
						</div>
						<div style={{float:'left',width:'80%'}}>
						<div style={{float:'left'}}>
						<h3 style={{textAlign:'center'}}>{this.props.params.uname}</h3>
						</div>
						<div style={{width:'100%',float:'left'}}>
						
						
						{(localStorage.user != u)?(
							<div >
							{this.chkFollowing()?(
							<div className = "col s2"  >
								<button value="Follow" style={followbStyle} onClick={this.followUser} >FOLLOW</button>
								
							</div>
							):(
							<div  className = "col s2">
								<button value="Unfollow" style={unfollowbStyle} onClick={this.unfollowUser}>UNFOLLOW</button>
							</div>)}

							</div>):(<div>
							
							</div>)}
						
						<button className="col s4 btn disabled" style={{backgroundColor:'blue',marginLeft:'2%'}}>Followers {this.state.nfollowers}</button>
						<button className="col s4 btn disabled" style={{backgroundColor:'blue'}}>Following {this.state.nfollowing}</button>
						
						
						</div>
						</div>
						<div className = "z-depth-1">
						{personalTweets(this.props.params.uname, ["SearchUserTweet"+u,"SwitchUserTweet"+u])}
						</div>
					</div>
				</div>
				)
			
			}
	})
)