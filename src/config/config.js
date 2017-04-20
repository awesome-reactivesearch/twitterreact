// `config` object contains all the app credentials
const config = {
	credential_tweets: {
		url: "https://scalr.api.appbase.io",
		app: "twitter-app",
		username: "p1KdUffK0",
		password: "9040f694-9f71-408b-8ce2-573de67fb0c4",
		type: "tweets"
	},
	credential_users: {
		url: "https://scalr.api.appbase.io",
		app: "twitter-app",
		username: "p1KdUffK0",
		password: "9040f694-9f71-408b-8ce2-573de67fb0c4",
		type: "users"
	},
	ReactiveList: {
		size: 100,
		from: 0
	},
	tweetsSortOptions: [{
		appbaseField: "createdAt",
		sortBy: "desc"
	}]
};

const appbaseRef = new Appbase({
	url: config.credential_tweets.url,
	appname: config.credential_tweets.app,
	username: config.credential_tweets.username,
	password: config.credential_tweets.password
});

module.exports = {
	config,
	appbaseRef
};
