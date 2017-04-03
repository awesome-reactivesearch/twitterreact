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
// `NavBar` component that returns navigation bar component
const NavBar = (props) => {
	// `showGlobal` flg set to show Global Tweets or cleared to show Personal Tweets
	var showGlobal = (props.query === undefined) ? -1 : props.query.show
	// `CustomQueryT` function is used by `DataController` or `ToggleButton` sensor.
	// For `ToggleButton` sensor will set default data value paramters while `DataController` will set data=`default`
	const CustomQueryT = function(data) {
		if (data != 'default' && props.pflg != 1) {
			if (data[0].value === '') {
				return {
					query: {
						match_all: {}
					}
				};
			}
			else {
				
				return {
					query: {
						match: {
							by: data[0].value
						}
					}
				};
			}
		}
		if (showGlobal == 1) {
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

	return (
		<div className="navbar-fixed">
			<nav style={{color:'black',backgroundColor:'#dadada', height:'60px'}}>
				<div className="nav-wrapper" style={{margin:'0.4% auto auto auto'}} >
					<div style={{float:'left',fontSize:'125%',width:'15%'}}>
						Twitter on Appbase
					</div>
					<div style={{width:'35%',float:'left'}}>
						// Search Form
						<form id="searchbar" onSubmit={props.onSearch}>
							<input type="text blue accent-2" style={{height:'65%',width:'45%',margin:'1% 0 0 0'}} placeholder="Search Tweets..."/>
							<input type="submit" value="Search" style={{width:'20%', textTransform: 'capitalize'}} className="waves-effect waves-light btn" />
						</form>
						
					</div>
					// `pflg` when set `-1` denotes that the page is either loginPg or searchPg it won't require button to route to `Profile` view or `Logout`
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
					<div style={{float:'right',width:'50%'}}>
						<div style={{float:'right',width:'50%'}}>
							<button style={{width:'30%'}} className="left hide-on-med-and-down waves-effect waves-light btn"  value="Profile" onClick={props.goProfile} >Profile</button>
							<button style={{width:'30%'}} value="Logout" onClick={props.logOut} className="waves-effect waves-light btn" >Logout</button>
						</div>
						<div style={{float:'left',width:'50%'}} className="right hide-on-med-and-down z-depth-0" >
							{(props.pflg==1)?(
							// `pflg` set to 1 denotes that the page is proflie view of any user. Only Tweets of that user are to be displayed, hence `DataController` sensor is required to generate Personal Tweet.
							<div key={props.user}>
								<button style={{width:'35%'}} className="waves-effect waves-light grey lighten-4 btn" value="Global" onClick={props.goGlobalFeed}>Global</button>
								<button style={{width:'35%'}} className="waves-effect waves-light grey lighten-4 btn" value="Personal" onClick={props.goPresonalFeed}>Personal</button>
								<div >
									<DataController
										componentId={"UserProfileTweet"}
										customQuery= {CustomQueryT}
										showUI = {false}
									/>
								</div>
							</div>):(
							// `pflg` set to 0 shows that the page is dashboard, Toggling between Global Feed and Personal Feed is possible, `ToggleButton` is required
							<div key={props.user}>
							{(props.query.show==1)?(
								// For `query.show` is set to 1 when user switches from profilePg to dashboard to see Global Feed first, `defaultSelected` is `Global` here.
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
									defaultSelected = {['Global']}
								/>):(
								// For `query.show` is set to 0 when user switches from any page to dashboard to see Personal Feed first, `defaultSelected` is `Personal` here.
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
									defaultSelected = {['Personal']}
								/>)}
							</div>
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