import React, { Component } from "react";
import { DataController } from "@appbaseio/reactivesearch";
import { appbaseRef } from "../config/config";
import { NavBar } from "../nav/navbar";
import { PersonalTweets } from "../helper/tweets";

// `LoginForm` renders a form with a username text input field.
const LoginForm = (props) => {
    const txtstyle = {
        width: "85%",
        backgroundColor: "#fafafa",
        margin: "3% 3% 4% 7%",
        fontSize: "20px"
    };
    return (
        <form style={{ padding: "0.5%" }} className="col s6 m3 offset-s2 offset-m5 z-depth-1 grey lighten-2" id="login" onSubmit={props.onLogin}>
            <input type="text blue accent-2" placeholder="Name" style={txtstyle} /><br />
            <input type="submit" style={{ width: "50%", margin: "0% auto 2% 23%", padding: "2px" }} value="Enter your name" className="waves-effect waves-light btn" />
        </form>
    );
};

// `Login` component to render the login page of app
export default class Login extends Component {
    constructor(props) {
        super(props);
        this.onLogin = this.onLogin.bind(this);
        this.onSearch = this.onSearch.bind(this);
    }

    // Function called when user submits Login form
    onLogin(event) {
        event.preventDefault();
        const uname = event.target[0].value.trim();

        if (uname === "")   { return; }
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
            }           else {
                localStorage.ufollowing = [];
            }
            if (chk === 0) {
                // If user is not found, index into appbase.io as a new user
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

    // Change to search route when user enters a search string
    onSearch(event) {
        event.preventDefault();
        const t = event.target[0].value;
        this.props.router.push(`/search/${t}`);
    }

    // `render(..)` renders the Login component. <br />
    // `pflg` flag is set to `-1` to get navigation bar of homepg.<br />
    //  here, `LoginForm` is used to render the user login form.<br />
    // `ReactiveList` actuator component is used to render tweets received from `GlobalTweets` sensor component.<br />
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
                        <DataController
                            componentId="GlobalTweet"
                            appbaseField="by"
                            customQuery={
                                function () {
                                    return {
                                        query: {
                                            match_all: {}
                                        }
                                    };
                                }
                            }
                            showUI={false}
                        />
                        <PersonalTweets
                            user={"$all"}
                            path={this.props.location.pathname}
                            reactOn={["GlobalTweet"]}
                        />
                    </div>
                </div>

            </div>
        );
    }
    }

