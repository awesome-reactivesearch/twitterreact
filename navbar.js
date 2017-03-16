import React, { Component } from 'react';
import {
	ReactiveBase,
	ReactivePaginatedList,
	DataController,
	TextField,
	ToggleButton
} from '@appbaseio/reactivebase';
import {config, onDataTweets, onDataUsers} from './config.js';

const appbaseRef = new Appbase({
	url: config.credential_tweets.url,
	appname: config.credential_tweets.app,
	username: config.credential_tweets.username,
	password: config.credential_tweets.password
});
var val = '';
const navBar=function(user, goProfile, logOut, pflg){
	const CustomQueryTweets=function(value){
				// HACK: Check if the value is changed will again mounting the TextField component.
				if(val===value){
					value="";
				}
				if(value === undefined || value===""){
					return{
						query:{
							match_all:{}
						}
					}
				}
				else{
					val=value;
					return {
							query: {
								"bool": { 
									"must": [
										{match_all:{}}, 
										{ "match": { msg: value}}
									],
								}
							}
						};	
				}
				};
	const CustomQueryT=function(data){
				// debugger;
				if(data!=undefined){
					if(data[0].value===''){
						return{
							query : {
									match_all : {}
								}
							};
					}
					else{
						return{
							query : {
								match: {by:data[0].value}
							}
						};
					}
				}
				return {
						query: {
							match: {by : user}
						}
					};	
				
				};
	return(
	
		<div className="navbar-fixed">
		<nav style={{color:'black',backgroundColor:'#dadada', height:'60px'}}>
		<div className="nav-wrapper" >
		
		<ReactiveBase
				app={config.credential_tweets.app}
				username= {config.credential_tweets.username}
				password= {config.credential_tweets.password}
				type = {config.credential_tweets.type}
			>
			
			
			<div style={{float:'left',fontSize:'125%',width:'15%',marginLeft:'1% 2% auto 2%'}}>
			Twitter on Appbase
			</div>
			<div style={{widh:'8%',float:'left'}}>
			<TextField
				componentId = {"SearchMyTweet"+user}
				appbaseField = "msg"
				placeholder = "Search tweet here..."
				customQuery= {CustomQueryTweets}
				defaultSelected = ""
			/>
			
			
			</div>
			
		<div style={{float:'right',margin: '0px'}}>
		{(pflg===0)?(
			<button className="left hide-on-med-and-down waves-effect waves-light btn"  value="Profile" onClick={goProfile} >Profile</button>
			):(
			<button className="left hide-on-med-and-down waves-effect waves-light btn"  value="Profile" onClick={goProfile}>Personal Feed</button>
			)}
			<button value="Logout" onClick={logOut} className="waves-effect waves-light btn" >Logout</button>
		</div>

		<div className="right hide-on-med-and-down z-depth-0" style={{width:'30%',float:'left',marginLeft:'2%'}}>
			
			<ToggleButton
				componentId = {"SwitchTweet"+user}
				appbaseField = "by"
				multiSelect = {false}
				data = {[
					{
						'label':'Global',
						'value':''
					},
					{
						'label':'Personal',
						'value':user
					}
					]}
				customQuery = {CustomQueryT}
				
			/>
			</div>
		</ReactiveBase>
		</div>
		</nav>	
		</div>
		);
}

module.exports = {
	navBar: navBar
};