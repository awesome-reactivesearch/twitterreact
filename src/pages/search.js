import React, { Component } from "react";
import {
    ReactiveList,
    ReactiveBase,
    DataController
} from "@appbaseio/reactivesearch";
import { config } from "../config/config";
import { PersonalTweets } from "../helper/tweets";
import { onDataUsers } from "../helper/users";
import { NavBar } from "../nav/navbar";

// `Search` component is rendered when user searches for tweets or users
export default class Search extends Component {
    constructor(props) {
        super(props);
        this.onSearch = this.onSearch.bind(this);
        this.CustomQueryTweets = this.CustomQueryTweets.bind(this);
        this.CustomQueryUsers = this.CustomQueryUsers.bind(this);
    }

    // Change to search route when user enters a search string
    onSearch(event) {
        event.preventDefault();
        const t = event.target[0].value;
        this.props.router.replace(`/search/${t}`);
    }

    // `CustomQueryTweets` function to return `match` query for `tweets` type
    CustomQueryTweets() {
        const phrase = this.props.params.txt;
        return {
            query: {
                match: {
                    msg: phrase
                }
            }
        };
    }

    // `CustomQueryUsers` function to return `match` query for 'users' type
    CustomQueryUsers() {
        const phrase = this.props.params.txt;
        return {
            query: {
                match: {
                    name: phrase
                }
            }
        };
    }

    // `render()` renders the component with top `NavBar` and `ReactiveList`s for displaying matched tweets and users
    render() {
        const pflg = -1;
        // `pflg` set to -1 that shows that the current page is searchpage
        // Here, `NavBar` component renders navigation bar.
        // `ReactiveList` actuator component is used to render tweets received from `SearchTweet` sensor component.<br />
        return (

            <div className="row" key={this.props.params.txt}>
                <NavBar
                    user={this.props.params.uname}
                    pflg={pflg}
                    onSearch={this.onSearch}
                    path={this.props.location.pathname}
                />

                <div className="col s4 offset-s1 form-m2">
                    <DataController
                        componentId="SearchTweet"
                        customQuery={this.CustomQueryTweets}
                        showUI={false}
                    />
                    <PersonalTweets
                        user={"$all"}
                        path={"/searchpg/"}
                        reactOn={["SearchTweet"]}
                    />
                </div>

                <div className="col s4 offset-s1 form-m2">
                    <ReactiveBase
                        app={config.credential_appbase.app}
                        credentials={config.credential_appbase.credentials}
                        type={config.credential_appbase.type}
                    >
                        <DataController
                            componentId="SearchUser"
                            customQuery={this.CustomQueryUsers}
                            showUI={false}
                        />
                        <ReactiveList
                            title="Users"
                            componentId="UsersFound"
                            appbaseField="name"
                            from={config.ReactiveList.from}
                            size={config.ReactiveList.size}
                            stream={true}
                            requestOnScroll={true}
                            onData={onDataUsers}
                            react={{
                                and: ["SearchUser"]
                            }}
                        />
                    </ReactiveBase>
                </div>
            </div>
        );
    }
    }
