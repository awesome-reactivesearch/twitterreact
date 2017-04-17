import React from "react";
import {
	DataController,
	ToggleButton
} from "@appbaseio/reactivesearch";

const NavOptions = (props) => {
	if (props.pflg === -1) {
		return (
			<div style={{ float: "right", margin: "0 2% 0 0", width: "15%" }}>
				{(props.path === "/") ? (
					<div>
						<DataController
							componentId="GlobalTweet"
							customQuery={props.CustomQueryT}
							showUI={false}
						/>
						<a href="./docs/login.html" style={{ color: "white", lineHeight: "250%", padding: "0 4% 0 4%"}} className="waves-effect waves-light btn blue lighten-2">View Code
						</a>
					</div>
		) : (<div />)}
			</div>);
	}

	return (
		<div style={{ float: "right", width: "50%" }}>
			<div style={{ float: "right", width: "50%" }}>
				<button style={{ width: "30%" }} className="left hide-on-med-and-down waves-effect waves-light btn" value="Profile" onClick={props.goProfile} >Profile</button>
				<button style={{ width: "30%" }} value="Logout" onClick={props.logOut} className="waves-effect waves-light btn" >Logout</button>
			</div>
			<div style={{ float: "left", width: "50%" }} className="right hide-on-med-and-down z-depth-0" >

				{(props.pflg === 1) ? (
					<div key={props.user}>
						<button style={{ width: "35%" }} className="waves-effect waves-light grey lighten-4 btn" value="Global" onClick={props.goGlobalFeed}>Global</button>
						<button style={{ width: "35%" }} className="waves-effect waves-light grey lighten-4 btn" value="Personal" onClick={props.goPresonalFeed}>Personal</button>
						<div >
							<DataController
								componentId={"UserProfileTweet"}
								customQuery={props.CustomQueryT}
								showUI={false}
							/>
						</div>
					</div>) : (
						<div key={props.user}>
							{(props.query.show == 1) ? (
								<ToggleButton
									componentId="UserTweet"
									appbaseField="by"
									multiSelect={false}
									data={[
										{
											label: "Global",
											value: ""
										},
										{
											label: "Personal",
											value: props.user
										}
									]}
									customQuery={props.CustomQueryT}
									defaultSelected={["Global"]}
								/>) : (
									<ToggleButton
										componentId="UserTweet"
										appbaseField="by"
										multiSelect={false}
										data={[
											{
												label: "Global",
												value: ""
											},
											{
												label: "Personal",
												value: props.user
											}
										]}
										customQuery={props.CustomQueryT}
										defaultSelected={["Personal"]}
									/>)}
						</div>
				)}
			</div>
		</div>);
};

module.exports = {
	NavOptions
};
