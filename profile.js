import React, { Component } from "react";
import {
	config,
	User
} from "./config";
import { PersonalTweets } from "./tweets";
import {
	ListFollowing,
	ListFollowers
} from "./users";
import { NavBar } from "./navbar";

const appbaseRef = new Appbase({
	url: config.credential_users.url,
	appname: config.credential_users.app,
	username: config.credential_users.username,
	password: config.credential_users.password
});
let u = "";
let nfollowers = 0;
let nfollowing = 0;
export default class Profile extends Component {

	constructor(props) {
		super(props);
		this.logOut = this.logOut.bind(this);
		this.goLocal = this.goLocal.bind(this);
		this.followUser = this.followUser.bind(this);
		this.unfollowUser = this.unfollowUser.bind(this);
		this.updateUser = this.updateUser.bind(this);
		this.chkFollowing = this.chkFollowing.bind(this);
		this.onSearch = this.onSearch.bind(this);
		this.goGlobalFeed = this.goGlobalFeed.bind(this);
		this.goPresonalFeed = this.goPresonalFeed.bind(this);
		this.onDataFollowers = this.onDataFollowers.bind(this);
		this.onDataFollowing = this.onDataFollowing.bind(this);
		this.goProfile = this.goProfile.bind(this);
		this.state = {
			nfollowers: 0,
			nfollowing: 0
		};
	}

	onSearch(event) {
		event.preventDefault();
		const t = event.target[0].value;
			// debugger;

			// debugger;
		this.props.router.push(`search/${t}`);
	}

	onDataFollowers(response, err) {
		let result = null;
		if (err) {
			return result;
		} else if (response) {
			let combineData = response.currentData;
			if (response.mode === "historic") {
				combineData = response.currentData.concat(response.newData);
			} else if (response.mode === "streaming") {
				combineData.unshift(response.newData);
			}
			if (combineData.length !== 0) {
				const following = combineData[0]._source.followers;
				nfollowing = following.length;
				if (following !== undefined) {
					result = following.map((markerData, index) => (<User name={markerData} />));
				}
			}
			this.setState({
				nfollowers,
				nfollowing
			});
		}
		return result;
	}

	onDataFollowing(response, err) {
		let result = null;
		if (err) {
			return result;
		} else if (response) {
			let combineData = response.currentData;
			if (response.mode === "historic") {
				combineData = response.currentData.concat(response.newData);
			} else if (response.mode === "streaming") {
				combineData.unshift(response.newData);
			}
			let followers = [];
			if (combineData.length !== 0) {
				followers = combineData[0]._source.following;
			}
			nfollowers = followers.length;
			if (followers !== undefined) {
				result = followers.map((markerData, index) => (<User name={markerData} />));
			}
		}
		this.setState({
			nfollowers,
			nfollowing
		});
		return result;
	}

	updateUser(follow, username) {
		if (username === undefined) {
			username = u;
		}
			// debugger;
		const me = localStorage.user;
		appbaseRef.search({
			type: "users",
			body: {
				query: {
					match: {
						name: me
					}
				}
			}
		}).on("data", (res) => {
			const meId = res.hits.hits[0]._id;
			const mefollowing = res.hits.hits[0]._source.following;
			const mefollowers = res.hits.hits[0]._source.followers;
					// debugger;
			if (follow) {
				mefollowing.push(username);
			} else {
				const index = mefollowing.indexOf(username);
				mefollowing.splice(index, 1);
						// debugger;
			}
			localStorage.ufollowing = mefollowing;
				// debugger;
			appbaseRef.index({
				type: "users",
				id: meId,
				body: {
					name: me,
					followers: mefollowers,
					following: mefollowing
				}
			}).on("error", (error) => {
				console.error(error);
			});
		}).on("error", (err) => {
			console.error(err);
		});
		appbaseRef.search({
			type: "users",
			body: {
				query: {
					match: {
						name: username
					}
				}
			}
		}).on("data", (res) => {
			const uId = res.hits.hits[0]._id;
			const ufollowing = res.hits.hits[0]._source.following;
			const ufollowers = res.hits.hits[0]._source.followers;
			if (follow) {
				ufollowers.push(me);
						// debugger;
			} else {
				const index = ufollowers.indexOf(me);
				ufollowers.splice(index, 1);
						// debugger;
			}
				// debugger;
			appbaseRef.index({
				type: "users",
				id: uId,
				body: {
					name: username,
					followers: ufollowers,
					following: ufollowing
				}
			}).on("data", function (response) {
				this.setState({
					nfollowers: ufollowing.length,
					nfollowing: ufollowers.length
				});
			}).on("error", (error) => {
				console.error(error);
			});
		}).on("error", (err) => {
			console.error(err);
		});
	}

	chkFollowing() {
		u = this.props.params.uname;
		const followingList = localStorage.ufollowing;
				// debugger;

		if (followingList.indexOf(u) === -1) {
			return true;
		}
		return false;
	}

	followUser(event) {
		event.preventDefault();
		this.updateUser(true);
	}

	unfollowUser(event) {
		event.preventDefault();
		this.updateUser(false);
	}

	goLocal(event) {
		event.preventDefault();
		u = localStorage.user;
		this.props.router.replace(`/${u}`);
	}


	logOut(event) {
		event.preventDefault();
		this.props.router.push("/");
		delete localStorage.user;
	}

	goGlobalFeed(event) {
		event.preventDefault();
		const loggedUser = localStorage.user;
		this.props.router.replace({ pathname: `/${loggedUser}`, query: { show: 1 } });
	}

	goPresonalFeed(event) {
		event.preventDefault();
		const loggedUser = localStorage.user;
		this.props.router.replace({ pathname: `/${loggedUser}`, query: { show: 0 } });
	}

	goProfile(event) {
		event.preventDefault();
		const loggedUser = localStorage.user;
		this.props.router.replace(`/profile/${loggedUser}`);
	}

	render() {
		u = this.props.params.uname;
			// debugger;
		const msgStyles = {
			maxWidth: 800,
			marginLeft: "10%",
			marginTop: "5%"
		};
			// debugger;
		const pflg = 1;
		const followbStyle = {
			backgroundColor: "#428bfc",
			color: "white",
			borderRadius: "3px",
			border: "none",
			padding: "6%"
		};
		const unfollowbStyle = {
			backgroundColor: "#d2322d",
			color: "white",
			borderRadius: "3px",
			border: "none",
			padding: "6%"
		};
		return (
			<div className="row" >
				<NavBar
					user={this.props.params.uname}
					logOut={this.logOut}
					pflg={pflg}
					onSearch={this.onSearch}
					goGlobalFeed={this.goGlobalFeed}
					goPresonalFeed={this.goPresonalFeed}
					goProfile={this.goProfile}
				/>

				<div className="col m2 s6 offset-s1 offset-m1" style={{ marginTop: "3%" }}>
					<ListFollowers
						user={this.props.params.uname}
						onDataFollowers={this.onDataFollowers}
					/>
					<ListFollowing
						user={this.props.params.uname}
						onDataFollowing={this.onDataFollowing}
					/>


				</div>
				<div className="col s12 m7 l91" style={msgStyles}>
					<div style={{ float: "left", width: "20%" }}>
						<img style={{ height: "15%", margin: "15% 10% 15% 15%" }} src="../user@2x.png" alt="UserImage" />
					</div>
					<div style={{ float: "left", width: "80%" }} >
						<div style={{ float: "left" }}>
							<h3 style={{ textAlign: "center" }}>{this.props.params.uname}</h3>
						</div>
						<div style={{ width: "100%", float: "left" }} key={this.state}>
							{(localStorage.user !== u) ? (
								<div className="col s2" >
									{this.chkFollowing() ? (
										<button value="Follow" style={followbStyle} onClick={this.followUser} >Follow</button>
									) : (
										<button value="Unfollow" style={unfollowbStyle} onClick={this.unfollowUser}>Unfollow</button>
									)}
								</div>) : (
									<div />)}
							<div key={this.props.params.uname}>
								<button className="col s4 btn disabled" style={{ backgroundColor: "blue", marginLeft: "2%" }}>Followers {this.state.nfollowing}</button>
								<button className="col s4 btn disabled" style={{ backgroundColor: "blue" }}>Following {this.state.nfollowers}</button>
							</div>
						</div>
					</div>
					<div className="col s8">
						<PersonalTweets
							user={u}
							reactOn={["UserProfileTweet"]}
						/>
					</div>
				</div>
			</div>
		);
	}
	}
