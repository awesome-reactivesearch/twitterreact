import React, {
	Component
} from "react";
import { ReactiveList } from "@appbaseio/reactivebase";
import {
	config,
	onDataTweets,
	LoginForm
} from "./config";
import { NavBar } from "./navbar";

require("@appbaseio/reactivebase/dist/css/style.min.css");

const appbaseRef = new Appbase({
	url: config.credential_tweets.url,
	appname: config.credential_tweets.app,
	username: config.credential_tweets.username,
	password: config.credential_tweets.password
});
let uname = "";
let val = "";
export default class Login extends Component {
	constructor(props) {
		super(props);
		this.onLogin = this.onLogin.bind(this);
		this.onSearch = this.onSearch.bind(this);
	}

	onLogin(event) {
		event.preventDefault();
			// debugger;
		uname = event.target[0].value;

		if (uname === "")			{ return; }
				// var chk=1;
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
					// console.log(chk)
					// console.log('query result', res.hits.total);
					// debugger;
			if (chk !== 0) {
				localStorage.ufollowing = (res.hits.hits[0]._source.following);
						// debugger;
			}				else {
				localStorage.ufollowing = [];
			}
			if (chk === 0) {
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
			// console.log('hey!!')
		this.props.router.push({ pathname: `/${uname}`, query: { show: 0 } });
	}

	onSearch(event) {
		event.preventDefault();
		const t = event.target[0].value;
			// debugger;
			// console.log('bitch please', t)
			// debugger;
		this.props.router.push(`search/${t}`);
	}


	CustomQuery(value) {
			// HACK: Check if the value is changed will again mounting the TextField component.
		if (val === value) {
			value = "";
		}
			// debugger;
		if (value === undefined || value === "") {
				// debugger;
			return {
				query: {
					match_all: {}
				}
			};
		}
				// debugger;
		val = value;
		return {
			term: {
				msg: value
			}
		};
	}


	render() {
			// debugger;
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

