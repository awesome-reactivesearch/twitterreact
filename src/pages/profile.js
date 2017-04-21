import React, { Component } from "react";
import { DataController } from "@appbaseio/reactivesearch";
import { PersonalTweets } from "../helper/tweets";
import {
    ListFollowing,
    ListFollowers,
    User,
    updateUser
} from "../helper/users";
import { NavBar } from "../nav/navbar";

// `ChkFollowing` chks whether the logged in user follows the current user and returns a *Follow or Unfollow* button accordingly
const ChkFollowing = (props) => {
    if (props.setKey) {
        return (<button value="Unfollow" id="unfollowbutton" onClick={props.unfollowUser} key={props.setKey}>Unfollow</button>);
    }
    return (<button value="Follow" id="followbutton" onClick={props.followUser} key={props.setKey}>Follow</button>);
};

// `Profile` component renders profile page of the app
export default class Profile extends Component {
    // Initialize state with number of followers=0, number of following=0, followingFlg=false
    constructor(props) {
        super(props);
        this.logOut = this.logOut.bind(this);
        this.goLocal = this.goLocal.bind(this);
        this.followUser = this.followUser.bind(this);
        this.unfollowUser = this.unfollowUser.bind(this);
        this.onSearch = this.onSearch.bind(this);
        this.goGlobalFeed = this.goGlobalFeed.bind(this);
        this.goPresonalFeed = this.goPresonalFeed.bind(this);
        this.onDataFollowers = this.onDataFollowers.bind(this);
        this.onDataFollowing = this.onDataFollowing.bind(this);
        this.goProfile = this.goProfile.bind(this);
        this.state = {
            nfollowers: 0,
            nfollowing: 0,
            followingFlg: false
        };
    }

    // Change to search route when user enters a search string
    onSearch(event) {
        event.preventDefault();
        const t = event.target[0].value;


        this.props.router.push(`/search/${t}`);
    }

    // Updates the followers count. Called when the `ListFollowers` component gets data.
    onDataFollowers(response) {
        let nfollowing = 0;
        let result = null;
        let followingFlg = false;
        const followingList = localStorage.ufollowing;
        if (response) {
            const combineData = response;
            if (combineData.length !== 0) {
                const following = combineData._source.followers;
                nfollowing = following.length;
                if (following !== undefined) {
                    result = following.map(markerData => (<User name={markerData} />));
                }
            }
            if (followingList.indexOf(this.props.params.uname) !== -1) {
                followingFlg = true;
            }
            this.setState({
                nfollowers: this.state.nfollowers,
                nfollowing,
                followingFlg
            });
        }
        return result;
    }

    // Updates the following count. Called when the `ListFollowing` component gets data.
    onDataFollowing(response) {
        let result = null;
        let nfollowers = 0;
        if (response) {
            const combineData = response;
            let followers = [];
            if (combineData.length !== 0) {
                followers = combineData._source.following;
            }
            nfollowers = followers.length;
            if (followers !== undefined) {
                result = followers.map(markerData => (<User name={markerData} />));
            }
        }
        this.setState({
            nfollowers,
            nfollowing: this.state.nfollowing,
            followingFlg: this.state.followingFlg
        });
        return result;
    }

    // on Follow pressed
    followUser(event) {
        event.preventDefault();
        if(this.state.followingFlg){
            return;
        }
        updateUser(true, this.props.params.uname);
    }

    // on Unfollow pressed
    unfollowUser(event) {
        event.preventDefault();
        if(!this.state.followingFlg){
            return;
        }
        updateUser(false, this.props.params.uname);
    }

    // on press profile go to present logged user's profile page
    goLocal(event) {
        event.preventDefault();
        const u = localStorage.user;
        this.props.router.replace(`/${u}`);
    }

    // on `Logout` button press, remove user session from localStorage and route to home
    logOut(event) {
        event.preventDefault();
        this.props.router.push("/");
        delete localStorage.user;
    }

    // on `Global` button pess, switch to logged in user's dashboard with a view showing global tweets.
    goGlobalFeed(event) {
        event.preventDefault();
        const loggedUser = localStorage.user;
        this.props.router.replace({ pathname: `/${loggedUser}`, query: { show: 1 } });
    }

    // on `Personal` button press, switch to logged in user's dashboard with a view showing personal tweets.
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

    // renders the profile component
    render() {
        const msgStyles = {
            maxWidth: 800,
            marginLeft: "10%",
            marginTop: "2%"
        };

        const pflg = 1;
        // `pflg` set to `1` i.e flage for navbar for profile page
        // `NavBar` component to render navigation bar for profile page.<br />
        // `ListFollowers`, `ListFollowing` components to show list of followers and following respectively.<br /><br />
        // The `userinfo` element shows user image, username and number of following,followers. <br />
        // It also gives the option to *follow* or *unfollow* the user.<br />
        // It contains `PersonalTweets` actuator component that receives tweets from `UserProfileTweet` DataController sensor in `NavBar`.
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

                <div id="userinfo" className="col s12 m7 l91" style={msgStyles}>
                    <div style={{ float: "left", width: "20%" }}>
                        <img style={{ height: "100px", margin: "15% 10% 15% 15%" }} src="/user@2x.png" alt="UserImage" />
                    </div>
                    <div style={{ float: "left", width: "80%" }} >
                        <div style={{ float: "left" }}>
                            <h3 style={{ textAlign: "center" }}>{this.props.params.uname}</h3>
                        </div>
                        <div style={{ width: "100%", float: "left" }} key={this.state}>
                            {(localStorage.user !== this.props.params.uname) ? (
                                <div className="col s2" key={this.state}>
                                    <ChkFollowing
                                        uname={this.props.params.uname}
                                        followUser={this.followUser}
                                        unfollowUser={this.unfollowUser}
                                        setKey={this.state.followingFlg}
                                    />
                                </div>) : (
                                    <div />)}
                            <div id="followstats" key={this.state.followingFlg}>
                                <button className="col s4 btn disabled" style={{ backgroundColor: "blue", marginLeft: "2%", marginRight: "1%" }}>Followers {this.state.nfollowing}</button>
                                <button className="col s4 btn disabled" style={{ backgroundColor: "blue" }}>Following {this.state.nfollowers}</button>
                            </div>
                        </div>
                    </div>
                    <div className="col s8" style={{ marginTop: "3%" }}>
                        <DataController
                            componentId={"UserProfileTweet"}
                            appbaseField="by"
                            defaultSelected={this.props.params.uname}
                            showUI={false}
                        />
                        <PersonalTweets
                            user={this.props.params.uname}
                            reactOn={["UserProfileTweet"]}
                        />
                    </div>
                </div>
            </div>
        );
    }
    }
