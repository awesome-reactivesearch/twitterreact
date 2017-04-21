// `config` object contains all the app credentials
const config = {
	credential_appbase: {
		url: "https://scalr.api.appbase.io",
		app: "twitter-app",
		credentials: "p1KdUffK0:9040f694-9f71-408b-8ce2-573de67fb0c4",
		type: "tweets,users"
	},
	ReactiveList: {
		size: 10,
		from: 0
	},
	tweetsSortOptions: [{
		appbaseField: "createdAt",
		sortBy: "desc"
	}]
};

const appbaseRef = new Appbase({
	url: config.credential_appbase.url,
	appname: config.credential_appbase.app,
	credentials: config.credential_appbase.credentials
});

module.exports = {
	config,
	appbaseRef
};
