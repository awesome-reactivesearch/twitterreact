import React, {
Component
} from 'react';
import {
	ReactiveBase,
	ReactivePaginatedList,
	DataController,
	TextField,
	ToggleButton
} from '@appbaseio/reactivebase';
import {
	config,
	onDataTweets,
	onDataUsers
} from './config.js';
const appbaseRef = new Appbase({
	url: config.credential_tweets.url,
	appname: config.credential_tweets.app,
	username: config.credential_tweets.username,
	password: config.credential_tweets.password
});
var user = '';
const NavBar = (props) => {
	var showGlobalPersonal = (props.query === undefined) ? -1 : props.query.show
	const CustomQueryT = function(data) {
		debugger;
		if (data != undefined && data != 'default' && props.pflg != 1) {
			if (data[0].value === '') {
				return {
					query: {
						match_all: {}
					}
				};
			}
			else {
				showGlobalPersonal = 0;
				return {
					query: {
						match: {
							by: data[0].value
						}
					}
				};
			}
		}
		if (showGlobalPersonal == 1) {
			// debugger;
			return {
				query: {
					match_all: {}
				}
			};
		}
		return {
			query: {
				match: {
					by: props.user
				}
			}
		};
	};
	// debugger;
	return (
		<div className="navbar-fixed">
			<nav style={{color:'black',backgroundColor:'#dadada', height:'60px'}}>
				<div className="nav-wrapper" >
					<div style={{float:'left',fontSize:'125%',width:'15%',margin:'auto 1% auto 2%'}}>
						Twitter on Appbase
					</div>
					<div style={{widh:'8%',float:'left'}}>
						<form id="searchbar" onSubmit={props.onSearch}>
							<input type="text blue accent-2" style={{height:'35px'}} placeholder="Search Tweets..."/>
							<input type="submit" value="Search" className="waves-effect waves-light btn" />
						</form>
						
					</div>
					{(props.pflg==-1)?(
					<div>
						{(props.path=='/')?(
							<div>
								<DataController
									componentId="GlobalTweet"
									customQuery= {CustomQueryT}
									showUI = {false}
								/>
							</div>
							):(<div></div>)}
					</div>):(
					<div>
						<div style={{float:'right',margin: '0px'}}>
							<button className="left hide-on-med-and-down waves-effect waves-light btn"  value="Profile" onClick={props.goProfile} >Profile</button>
							<button value="Logout" onClick={props.logOut} className="waves-effect waves-light btn" >Logout</button>
						</div>
						<div className="right hide-on-med-and-down z-depth-0" style={{width:'30%',float:'left',marginLeft:'2%'}}>
							
							{(props.pflg==1)?(
							<div>
								<button className="waves-effect waves-light grey lighten-4 btn" value="Global" onClick={props.goGlobalFeed}>Global</button>
								<button className="waves-effect waves-light grey lighten-4 btn" value="Personal" onClick={props.goPresonalFeed}>Personal</button>
								<div key={props.user}>
									<DataController
										componentId="UserTweet"
										customQuery= {CustomQueryT}
										showUI = {false}
									/>
								</div>
							</div>):(
							<ToggleButton
								componentId = "UserTweet"
								appbaseField = "by"
								multiSelect = {false}
								data = {[
								{
								'label':'Global',
								'value':''
								},
								{
								'label':'Personal',
								'value':props.user
								}
								]}
								customQuery = {CustomQueryT}
							/>
							)}
						</div>
					</div>)}
					
				</div>
			</nav>
		</div>
	);

}
module.exports = {
	NavBar: NavBar
};