const values = [{
	"label": "Local",
	"value": "Local"
}, {
	"label": "Global",
	"value": "Global"
}];
const config = {

    credentials: {
        url: "https://scalr.api.appbase.io",
        app: "Twitter",
        username: "0z092JD6X",
        password: "e559dc6b-8c12-40b8-b308-b2c4b6b7b972",
        type: "tweets"
    },
    DataController: {
		customQuery: {
			"query": {
				"match_all": {}
			}
		}
	},
    ReactiveList: {
		size: 25,
		from: 0
	},
	ToggleButton: {
		defaultSelected: [values[0].value],
		data: values
	},
}

module.exports = {
	config: config
};