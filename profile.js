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
var u = ''

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
					var following = combineData[0]._source.following
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
					var followers = combineData[0]._source.followers
					if(followers!=undefined){
						result = followers.map((markerData, index) => {
							return (<User name={markerData} />)	
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

		render(){
			const navStyle = {textAlign:'right',margin: '0'};
			u = this.props.params.uname
			let loggedin = localStorage.user;
			
			// debugger;
			return (
				<div className ="row" >
				<nav style={{height:'46px'}} className="z-depth-0">
					<div className="nav-wrapper grey lighten-3">
						<div style={navStyle}>
							<button value="GoLocal" onClick={this.goLocal} className="waves-effect waves-light btn">Personal Feed</button>
							<button value="Logout" onClick={this.logOut} className="waves-effect waves-light btn">Logout</button>
						</div>
					</div>
				</nav>
					
					<div className="col s2" >
						<img style={{height:'100px', marginLeft:'25%', marginTop:'15%'}} src="../user@2x.png" />
						<h3 style={{textAlign:'center'}}>{this.props.params.uname}</h3>
						{(localStorage.user != u)?(
							<div style={{textAlign:'center'}}>
							{(this.chkFollowing())?(
							<div>
								<button value="Follow" onClick={this.followUser}>Follow</button>
								{listFollowers(u,this.onDataFollowers)}
								{listFollowing(u,this.onDataFollowing)}
							</div>
							):(
							<div>
							<button value="Unfollow" onClick={this.unfollowUser}>Unfollow</button>
							{listFollowers(u,this.onDataFollowers)}
							{listFollowing(u,this.onDataFollowing)}
							</div>)}

							</div>):(<div>
							
							{listFollowers(u,this.onDataFollowers)}
							{listFollowing(u,this.onDataFollowing)}
							</div>)}
					</div>
					<div>
						
					</div>
			</div>
				)
			
		}
	})
)