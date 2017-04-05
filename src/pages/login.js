import React, {
	Component
} from "react";
import { ReactiveList } from "@appbaseio/reactivebase";
import { config } from "../config/config";
import { NavBar } from "../nav/navbar";
import { onDataTweets } from "../helper/tweets";

require("@appbaseio/reactivebase/dist/css/style.min.css");

const appbaseRef = new Appbase({
	url: config.credential_tweets.url,
	appname: config.credential_tweets.app,
	username: config.credential_tweets.username,
	password: config.credential_tweets.password
});
let uname = "";

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

// `Login` Component to render the login page of app
export default class Login extends Component {
	constructor(props) {
		super(props);
		this.onLogin = this.onLogin.bind(this);
		this.onSearch = this.onSearch.bind(this);
	}

	// Function called when user submits Login form
	onLogin(event) {
		event.preventDefault();
		uname = event.target[0].value;

		if (uname === "")			{ return; }
		// Search for existing username
		appbaseRef.search({
			type: "users",
			body: {
				query: {
					match: {
						name: uname
					}
				}
			}
		}).on("data", (res) => {
			const chk = res.hits.total;
			if (chk !== 0) {
				// store user details in localStorage
				localStorage.ufollowing = (res.hits.hits[0]._source.following);
			}			else {
				localStorage.ufollowing = [];
			}
			if (chk === 0) {
				// If user not found, index new user
				appbaseRef.index({
					type: "users",
					body: {
						name: uname,
						followers: [],
						following: []
					}
				}).on("error", (error) => {
					console.error(error);
				});
			}
		}).on("error", (err) => {
			console.error(err);
		});
		localStorage.user = uname;
		this.props.router.push({ pathname: `/${uname}`, query: { show: 0 } });
	}

	// Function called when search is called
	onSearch(event) {
		event.preventDefault();
		const t = event.target[0].value;
		this.props.router.push(`search/${t}`);
	}

	// `render()` renders the Login component. <br />
	// `pflg` flag is set to `-1` to get navigation bar of homepg.<br />
	//  here, `LoginForm` is used to render Login form.<br />
	// `ReactiveList` actuator component to render tweets received from `GlobalTweets` sensor component.<br />
	render() {
		const pflg = -1;
		return (
			<div>
				<NavBar
					user={this.props.params.uname}
					pflg={pflg}
					onSearch={this.onSearch}
					path={this.props.location.pathname}
					query={{
						show: 1
					}}
				/>
				<div className="row" >
					<div style={{ margin: "2%" }}>
						<LoginForm
							onLogin={this.onLogin}
						/>
					</div>
				</div>

				<div className="row" style={{ margin: "0 10% 0 10%" }}>
					<div className="col s10 offset-s1">
						<ReactiveList
							componentId="GlobalTweets"
							appbaseField="msg"
							title="Public Tweets"
							from={config.ReactivePaginatedList.from}
							size={config.ReactivePaginatedList.size}
							sortOptions={config.tweetsSortOptions}
							onData={onDataTweets}
							requestOnScroll={true}
							react={{
								and: ["GlobalTweet"]
							}}
							stream={true}
						/>
					</div>
				</div>

			</div>
		);
	}
	}

