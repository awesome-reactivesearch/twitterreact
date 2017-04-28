import React from "react";

// Here, `pflg` when set `-1` denotes that the page is either loginPg or searchPg it won't require button to route to `Profile` view or `Logout` button<br />
// `pflg` set to `1` denotes that the page is proflie view of any user. Only Tweets of that user are to be displayed, hence `DataController` sensor is required to generate Personal Tweet.<br />
// `pflg` set to `1` also shows that the page is dashboard, Toggling between Global Feed and Personal Feed is possible in dashboard.<br /><br />
const NavOptions = (props) => {
    if (props.pflg === -1) {
        return (
            <div id="viewCodeBlock">
                {(props.path === "/") ? (
                    <div>
                        <a href="./docs/login.html" className="waves-effect waves-light btn blue lighten-2">View Code
                        </a>
                    </div>
        ) : (<div />)}
            </div>);
    }

    return (
        <div id="navOptions">
            <div id="navOptions">
                <button id="buttonNavOptions" className="left hide-on-med-and-down waves-effect waves-light btn" value="Profile" onClick={props.goProfile} >Profile</button>
                <button id="buttonNavOptions" value="Logout" onClick={props.logOut} className="waves-effect waves-light btn" >Logout</button>
            </div>
            <div id="tweetToggleBlock" className="right hide-on-med-and-down z-depth-0" >
                <div key={props.user}>
                    <button id="globalButton" className="waves-effect waves-light grey lighten-4 btn" value="Global" onClick={props.goGlobalFeed}>Global</button>
                    <button id="personalButton" className="waves-effect waves-light grey lighten-4 btn" value="Personal" onClick={props.goPresonalFeed}>Personal</button>
                </div>

            </div>
        </div>);
};

module.exports = {
    NavOptions
};
