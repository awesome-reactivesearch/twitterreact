import React from "react";
import { Link } from "react-router";

const values = [{
	label: "Local",
	value: "Local"
}, {
	label: "Global",
	value: "Global"
}];
const config = {
	credential_tweets: {
		url: "https://scalr.api.appbase.io",
		app: "Twitter",
		username: "0z092JD6X",
		password: "e559dc6b-8c12-40b8-b308-b2c4b6b7b972",
		type: "tweets"
	},
	credential_users: {
		url: "https://scalr.api.appbase.io",
		app: "Twitter",
		username: "0z092JD6X",
		password: "e559dc6b-8c12-40b8-b308-b2c4b6b7b972",
		type: "users"
	},
	DataController: {
		customQuery: {
			query: {
				match_all: {}
			}
		}
	},
	ReactiveList: {
		size: 100,
		from: 0
	},
	ReactivePaginatedList: {
		size: 10,
		from: 0
	},
	ToggleButton: {
		defaultSelected: [values[0].value],
		data: values
	},
	tweetsSortOptions: [{
		appbaseField: "createdAt",
		sortBy: "desc"
	}]

};
// on REceiving the user data
const onDataUsers = function (response, err) {
	let result = null;
	if (err) {
		return result;
	}	else if (response) {
		let combineData = response.currentData;
		if (response.mode === "historic") {
			combineData = response.currentData.concat(response.newData);
		}		else if (response.mode === "streaming") {
			combineData.unshift(response.newData);
		}
		if (combineData) {
			result = combineData.map((markerData, index) => {
				const marker = markerData._source;
				return (<User name={marker.name} />);
			});
		}
	}
	return result;
};
// on REceiving the tweets
const onDataTweets = function (response, err) {
	let result = null;
	if (err) {
		return result;
	}	else if (response) {
		let combineData = response.currentData;
		if (response.mode === "historic") {
			combineData = response.currentData.concat(response.newData);
		}		else if (response.mode === "streaming") {
			combineData.unshift(response.newData);
		}
		if (combineData) {
			result = combineData.map((markerData, index) => {
				const marker = markerData._source;
				return (<Tweet msg={marker.msg} usr={marker.by} date={marker.createdAt} />);
			});
		}
	}
	return result;
};
const LoginForm = (props) => {
	const txtstyle = {
		width: "85%",
		backgroundColor: "#fafafa",
		margin: "3%",
		fontSize: "20px"
	};
	return (
		<form className="col s6 m3 offset-s2 offset-m5 z-depth-1 grey lighten-2" id="login" onSubmit={props.onLogin}>
			<input type="text blue accent-2" placeholder="Name" style={txtstyle} /><br />
			<input type="submit" style={{ width: "85%", margin: "0 0 3% 2%", padding: "2px" }} value="Enter your name" className="waves-effect waves-light btn" />
		</form>
	);
};

// Tweet Component
const Tweet = props => (
	<div className="collection">
		<div className="collecton-item">
			<p id="tweet" style={{ margin: "1% 3% 1% 3%" }}>{props.usr}
				<label htmlFor="tweet" style={{ float: "right" }}>
					{new Date(props.date).toDateString()}
				</label>
				<br />
				{props.msg}
			</p>
		</div>
	</div>
		);
// User Component
const User = props => (
	<div className="collection">
		<div className="collecton-item">
			<p style={{ margin: "1% 2% 1% 2%" }}>
				<Link to={`/profile/${props.name}`}>{props.name}</Link>
			</p>
		</div>
	</div>
		);
module.exports = {
	config,
	onDataTweets,
	onDataUsers,
	User,
	LoginForm
};
