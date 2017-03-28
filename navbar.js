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
var user = '';
class NavBar extends Component{

	constructor(props) {
	    super(props);
	};
	
	CustomQueryTweets(value){
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

	CustomQueryT(data){
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

	render(){
		user = this.props.user
		
		const logOut = this.props.logOut
		const goProfile = this.props.goProfile
		const onSearch = this.props.onSearch
		const pflg = this.props.pflg
		// const SearchTweetActuator = (pflg==1)?"SearchUserTweet"+user:"SearchMyTweet"+user
		const SwitchTweetActuator = (pflg==1)?"SwitchUserTweet"+user:"SwitchMyTweet"+user

		// debugger;
		return(
		<div className="navbar-fixed">
		<nav style={{color:'black',backgroundColor:'#dadada', height:'60px'}}>
		<div className="nav-wrapper" >
		
		
			
			<div style={{float:'left',fontSize:'125%',width:'15%',marginLeft:'1% 2% auto 2%'}}>
			Twitter on Appbase
			</div>
			<div style={{widh:'8%',float:'left'}}>
			<form id="searchbar" onSubmit={onSearch}>
			<input type="text blue accent-2" ref="searchtxt"/><br/>
			<input type="submit" value="Search" className="waves-effect waves-light btn"/>
			</form>
			
			</div>
		{(pflg==-1)?(<div></div>):(
		<div>
		<div style={{float:'right',margin: '0px'}}>
		<button className="left hide-on-med-and-down waves-effect waves-light btn"  value="Profile" onClick={goProfile} >Profile</button>
		<button value="Logout" onClick={logOut} className="waves-effect waves-light btn" >Logout</button>
		</div>

		<div className="right hide-on-med-and-down z-depth-0" style={{width:'30%',float:'left',marginLeft:'2%'}}>
			
			<ToggleButton
				componentId = {SwitchTweetActuator}
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
				customQuery = {this.CustomQueryT}
				
			/>
			</div>
			</div>)}
		
		</div>
		</nav>	
		</div>
		);
	}
}

module.exports = {
	NavBar : NavBar
};