// `config` object contains all the app credentials
const config = {
	credential_tweets: {
		url: "https://scalr.api.appbase.io",
		app: "Twitter",
		username: "0z092JD6X",
		password: "e559dc6b-8c12-40b8-b308-b2c4b6b7b972",
		type: "tweets"
	},
	credential_users: {
		url: "https://scalr.api.appbase.io",
		app: "Twitter",
		username: "0z092JD6X",
		password: "e559dc6b-8c12-40b8-b308-b2c4b6b7b972",
		type: "users"
	},
	DataController: {
		customQuery: {
			query: {
				match_all: {}
			}
		}
	},
	ReactiveList: {
		size: 100,
		from: 0
	},
	ReactivePaginatedList: {
		size: 10,
		from: 0
	},
	tweetsSortOptions: [{
		appbaseField: "createdAt",
		sortBy: "desc"
	}]

};

module.exports = {
	config
};
