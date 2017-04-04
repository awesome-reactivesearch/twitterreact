import React from "react";
import {
	DataController,
	ToggleButton
} from "@appbaseio/reactivebase";

const NavBar = (props) => {
	const showGlobalPersonal = (props.query === undefined) ? -1 : props.query.show;
	const CustomQueryT = function (data) {
		// debugger;
		if (data !== "default" && props.pflg !== 1) {
			if (data[0].value === "") {
				return {
					query: {
						match_all: {}
					}
				};
			}


			return {
				query: {
					match: {
						by: data[0].value
					}
				}
			};
		}
		if (showGlobalPersonal === 1) {
			// debugger;
			return {
				query: {
					match_all: {}
				}
			};
		}
		// debugger;
		return {

			query: {
				match: {
					by: props.user
				}
			}
		};
	};
	// debugger;
	return (
		<div className="navbar-fixed">
			<nav style={{ color: "black", backgroundColor: "#dadada", height: "60px" }}>
				<div className="nav-wrapper" style={{ margin: "0.4% auto auto auto" }} >
					<div style={{ float: "left", fontSize: "125%", width: "15%" }}>
						Twitter on Appbase
					</div>
					<div style={{ width: "35%", float: "left" }}>
						<form id="searchbar" onSubmit={props.onSearch}>
							<input type="text blue accent-2" style={{ height: "65%", width: "45%", margin: "1% 0 0 0" }} placeholder="Search Tweets..." />
							<input type="submit" value="Search" style={{ width: "20%", textTransform: "capitalize" }} className="waves-effect waves-light btn" />
						</form>

					</div>
					{(props.pflg === -1) ? (
						<div>
							{(props.path === "/") ? (
								<div>
									<DataController
										componentId="GlobalTweet"
										customQuery={CustomQueryT}
										showUI={false}
									/>
								</div>
							) : (<div />)}
						</div>) : (
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
													customQuery={CustomQueryT}
													showUI={false}
												/>
											</div>
										</div>) : (
											<div key={props.user}>
												{(props.query.show === 1) ? (
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
														customQuery={CustomQueryT}
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
															customQuery={CustomQueryT}
															defaultSelected={["Personal"]}
														/>)}
											</div>
							)}
								</div>
							</div>)}

				</div>
			</nav>
		</div>
	);
};
module.exports = {
	NavBar
};
