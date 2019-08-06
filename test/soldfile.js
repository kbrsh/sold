const Sold = require("../index.js");

Sold({
	source: "src",
	destination: "build",
	feed: {
		JSON: {
			title: "Test Blog",
			home_page_url: "https://example.com/"
		}
	}
});
