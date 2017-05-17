import React from "react";
import { ReactiveList } from "@appbaseio/reactivesearch";
import { Link } from "react-router";
import moment from "moment";
import { config } from "../config/config";

// `PersonalTweets` component renders tweets via the `ReactiveList` actuator component.
const PersonalTweets = (props) => {
    // `ReactiveList` component renders the tweets in a list. Read more about the component [here](https://opensource.appbase.io/reactive-manual/v1.0.0/components/ReactiveList.html).
    const onDataTweets = function (markerData) {
        const marker = markerData._source;
        return (<Tweet key={marker.createdAt} msg={marker.msg} usr={marker.by} date={marker.createdAt} path={props.path} />);
    };
    return (
        <div key={`${props.user}Tweets`}>

            <ReactiveList
                title="Tweets"
                componentId="TweetsActuator"
                appbaseField="createdAt"
                from={config.ReactiveList.from}
                size={config.ReactiveList.size}
                stream={true}
                onData={onDataTweets}
                sortBy="desc"
                react={{
                    and: props.reactOn
                }}
                showResultStats={false}
            />
        </div>
    );
};

// `Tweet` component renders an individual tweet with a relative timestamp.
const Tweet = props => (
    <div className="collection">
        <div className="collecton-item">
            <p  className="tweet">
                {(props.path === "/twitterreact/") ? (props.usr) : (<Link to={`/twitterreact/profile/${props.usr}`}>{props.usr}</Link>)}
                <label htmlFor="tweet" className="labeltweet">
                    {(new moment(props.date)).fromNow()}
                </label>
                <br />
                {props.msg}
            </p>
        </div>
    </div>
        );

module.exports = {
    PersonalTweets,
    Tweet
};
