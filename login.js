import React, { Component } from 'react';
import ReactDom from 'react-dom';
import {
	ReactiveBase,
	ReactiveList,
	DataController,
	TextField,
	ToggleButton
} from '@appbaseio/reactivebase';
import {config} from './config.js';
const date = new Date();
const uStyles = {maxWidth: 400, margin: '10px auto 10px'};
const msgStyles = {maxWidth: 600, margin: '30px auto 50px'};
const wellStyles = {maxWidth: 600, margin: '40px auto 10px'};
const appbaseRef = new Appbase({
  url: config.credentials.url,
  appname: config.credentials.app,
  username: config.credentials.username,
  password: config.credentials.password
});
const CustomQuery= function(){
	return {
			query: {
				match_all: {}
			}
		};	
};
var onData=function(response, err) {
			
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
				console.log(combineData)
				if (combineData) {
					result = combineData.map((markerData, index) => {
						let marker = markerData._source;
						return (<Tweet msg={marker.msg} usr={marker.by} date={marker.createdAt}/>);
					});
				}
				return result;
			}
};
const get_global=(
		
		<ReactiveBase
				app={config.credentials.app}
    			username= {config.credentials.username}
				password= {config.credentials.password}
				type = {config.credentials.type}
			>
			
			<DataController
				componentId="GetGlobal"
				customQuery= {CustomQuery}
				showUI = {false}
			/>
			
			<div style={wellStyles}>
				<ReactiveList
					componentId="GlobalTweets"
					appbaseField="msg"
					title="Public Tweets"
					from={config.ReactiveList.from}
					size={config.ReactiveList.size}
					onData={onData}
					requestOnScroll={true}
					react={{
						'and': ["GetGlobal"]
					}}
				/>
			</div>
		
		</ReactiveBase>
);

var t = true;
var uname = '';

class Tweet extends Component{
	render(){
		var tweetStyle = {maxWidth: 550, margin: '10px auto 10px'};
		var unameStyle = {maxWidth: 550,margin: 'auto', color:'#0000aa'};
		return(
		<div style={tweetStyle}>
			<div style={unameStyle}>
			{this.props.usr}:
			</div>
			<div >
			{this.props.msg}
			</div>
		</div>
			)
	}
}

class HelloTwitter extends Component {
	onClick(event){
		console.log("logging out!")
		ReactDom.render(<Login />, document.getElementById('app'));
	}
	newTweet(event) {
		event.preventDefault()
		console.log('newTweet')
		var msg= document.getElementById('newtweet').value
		// console.log(by)
		appbaseRef.index({
		    type: config.credentials.type,
		    body: {"by": uname, "createdAt":date.getTime(), "msg":msg}
		}).on('data', function(response) {
		    console.log(response);
		}).on('error', function(error) {
		    console.log(error);
		});



	}
 	render() {
		const uStyles = {maxWidth: 400, margin: '30px auto 10px'};
  		const msgStyles = {maxWidth: 800, margin: '0px auto 10px'};
  		const s = {margin:'10px auto 10px'}
  		console.log(uname);
  		return (
		
			<ReactiveBase
				app={config.credentials.app}
    			username= {config.credentials.username}
				password= {config.credentials.password}
				type = {config.credentials.type}
			>
			
			<div className ="row" style={s}>
				
					<div className="col-xs-2" style={uStyles}>
					<TextField
                        title="User"
                        componentId="UserSensor"
                        appbaseField="by"
                        defaultSelected={uname}
                    />
                    <button value="Logout" onClick={this.onClick}>Logout</button>
					</div>
				
				<div className="row">
					<div className="col-xs-4" style={msgStyles}>
					<form  id="login" onSubmit={this.newTweet}>
		            	<div >
		                	<input type="text" placeholder="Your tweet here..." id="newtweet" />
		                	<input type="submit" value="Tweet" />
		            	</div>
					</form>
					</div>
					<div className="col s8 col-xs-8" style={msgStyles}>
					<ReactiveList
                        title="Tweets"
                        componentId="TweetsActuator"
                        appbaseField="msg"
                        from={config.ReactiveList.from}
						size={config.ReactiveList.size}
						stream={true}
  						requestOnScroll={true}
  						onData = {onData}
                        react={{
                            'and': ["UserSensor"]
                        }}
                    />
					</div>
				</div>
			</div>
			</ReactiveBase>
		);
	}
}

var get_hw = function(username){
	uname = username;
	return (ReactDom.render(<HelloTwitter/>, document.getElementById('app')));
}


class Login extends Component{
	onLogin(event){
		event.preventDefault()
		console.log('login function')
		var uname = document.getElementById('username').value
		if (uname === ""){
			console.log("error: no username")
			return;
		}
		return(get_hw(uname));

	}
	
	render(){
		
		const buttonStyles = {width: '60%' , 'marginTop': '3%', 'fontSize': '1.5em'}
		return(
		<div>
				<form  id="login" onSubmit={this.onLogin}>
            	<div  style={wellStyles}>
                	<input type="text" placeholder="Name" id="username" style={buttonStyles}/><br/>
                	<input type="submit" style={buttonStyles} value="login" />
            	</div>
				</form>

		{get_global}
		</div>
		)
	}
}

ReactDom.render(<Login />, document.getElementById('app'));