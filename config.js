import React from "react";

const values = [{
	label: "Local",
	value: "Local"
}, {
	label: "Global",
	value: "Global"
}];
// `config` object contains all the app credentials
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


// `LoginForm` returns form with a text input field.
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

module.exports = {
	config,
	LoginForm
};
