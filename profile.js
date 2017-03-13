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

const appbaseRef = new Appbase({
	url: config.credential_users.url,
	appname: config.credential_users.app,
	username: config.credential_users.username,
	password: config.credential_users.password
});
var u = '';
var val='';
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
			this.updateUser(event,true)
		},
		unfollowUser(event){
			this.updateUser(event,false)
		},
		updateUser(event, follow){
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
					mefollowing.push(u)
				}
				else{
					var index = mefollowing.indexOf(u)
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
						match: {name : u}
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
				}
				else{
					var index = ufollowers.indexOf(u)
					ufollowing.splice(index,1)
					// debugger;
				}
				// debugger;
				appbaseRef.index(
					{
					type: "users",
					id: uId,
					body:{
						"name":u,
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
					if(following!=undefined){
						result = following.map((markerData, index) => {
							return (<User name={markerData} />)	
						});
					}
				}
				// debugger;
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
					if(name == localStorage.user){
						unfollowflg=true;
					}
					if(followers!=undefined){
						result = followers.map((markerData, index) => {
							return (<User name={markerData} unfollowflg={unfollowflg}/>)	
						});
					}	
					
				}
				
				return result;
			}
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
		componentWillReceiveProps(nextProps) {
			
			// this.setState({x:(this.state.x+1)})
			if(this.state.x%2==0){
				
				this.setState({x:(this.state.x+1), b:!this.state.b})
			}
			else{
				this.setState({x:(this.state.x+1), b:this.state.b})
			}
			console.log('state', this.state)
		},
		componentWillMount() {
			console.log('hey11!')
			this.state = {x:1, b:true}
		},
		render(){
			u = this.props.params.uname
			console.log('username now is', u)
			const CustomQueryTweets=function(value){
				// HACK: Check if the value is changed will again mounting the TextField component.
				// debugger;
				if(val===value){
					value="";
				}
				if(value === undefined || value===""){
					return{
						query:{
							"match": { by: u}
						}
					}
				}
				else{
					val=value;
					return {
							query: {
								"bool": { 
									"must": [
										{ "match": { by: u}}, 
										{ "match": { msg: value}}
									],
								}
							}
						};	
				}
				};
			const navStyle = {textAlign:'right',margin: '0'};
			
			let loggedin = localStorage.user;
			let getUser = "GetUser" + u;
			let followerActuator = "FollowerActuator"+u;
			let followingActuator = "FollowingActuator"+u;
			// debugger;
			const msgStyles = {maxWidth: 800, marginLeft:'10%', marginTop:'5%'};
			// debugger;
			return (
				<div className ="row" >
				<div className="navbar-fixed">
				<nav style={{color:'black',backgroundColor:'#dadada', height:'60px', position:'fixed'}}>
				<div className="nav-wrapper">
				<div style={{margin:'3px 3px 3px 3px'}}>
					<div style={{float:'left',fontSize:'125%',width:'15%',marginLeft:'2%'}}>
					Twitter on Appbase
					</div>
					<div style={{widh:'20%',float:'left'}}>
				<ReactiveBase
					app={config.credential_tweets.app}
					username= {config.credential_tweets.username}
					password= {config.credential_tweets.password}
					type = {config.credential_tweets.type}
				>
				
				<TextField
					componentId = {"SearchUserTweet"}
					appbaseField = "msg"
					placeholder = "Search tweet here..."
					customQuery= {CustomQueryTweets}
					defaultSelected = {this.txtDefault}

				/>
				
				</ReactiveBase>
				</div>
				</div>
				<div style={navStyle}>
					<button value="GoLocal" onClick={this.goLocal} className="waves-effect waves-light btn">Personal Feed</button>
					<button value="Logout" onClick={this.logOut} className="waves-effect waves-light btn">Logout</button>
				</div>
				</div>
				</nav>
				</div>
					{(this.tryMe())?

					(<div className="col s12 m2 l2" >
						Broom
						{listFollowers(this.props.params.uname,this.onDataFollowers,followerActuator,getUser)}
						{listFollowing(this.props.params.uname,this.onDataFollowing,followingActuator,getUser)}
					</div>):(
					<div className="col s12 m2 l2" >
						Breed
						{listFollowers(this.props.params.uname,this.onDataFollowers,followerActuator,getUser)}
						{listFollowing(this.props.params.uname,this.onDataFollowing,followingActuator,getUser)}
					</div>)
					}
					
					
					<div className="col s12 m8 l91" style={msgStyles}>
						<div style={{float:'left', width:'20%'}}>
							<img style={{height:'15%',margin:'15% 10% 15% 15%'}} src="../user@2x.png" />
						</div>
						<div style={{float:'left',width:'25%'}}>
						<h3 style={{textAlign:'center'}}>{this.props.params.uname}</h3>
						{(localStorage.user != u)?(
							<div style={{textAlign:'center'}}>
							{(this.chkFollowing())?(
							<div style={{float:'left'}}>
								<button value="Follow" onClick={this.followUser}>Follow</button>
								
							</div>
							):(
							<div style={{float:'left'}}>
								<button value="Unfollow" onClick={this.unfollowUser}>Unfollow</button>
								
							</div>)}

							</div>):(<div>
							
							</div>)}
						</div>
						<div className = "z-depth-1">
						{personalTweets(this.props.params.uname, "SearchUserTweet")}
						</div>
					</div>
				</div>
				)
			
			}
	})
)