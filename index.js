const marked = require("meta-marked");
const fs = require("fs");
const path = require("path");

const markdownExtensions = ["markdown", "mdown", "mkdn", "mkd", "md"];

const engines = {
	ejs: (template, data, options, done) => {
		done(require("ejs").render(template, data, options));
	},
	handlebars: (template, data, options, done) => {
		const Handlebars = require("handlebars");

		if (options !== undefined) {
			options(Handlebars);
		}

		done(Handlebars.compile(template)(data));
	},
	pug: (template, data, options, done) => {
		done(require("pug").compile(template, options)(data));
	}
};

const log = (format, ...args) => {
	console.log(`\x1b[34msold\x1b[0m ${format}`, ...args);
};

const logOnce = () => {
	let logged = false;

	return (...args) => {
		if (logged === false) {
			log(...args);
			logged = true;
		}
	};
};

const compile = (destination, template, data, engine, options) => {
	(typeof engine === "function" ? engine : engines[engine.toLowerCase()])(template, data, options, (result) => {
		fs.writeFileSync(destination, result);
	});
};

const compileJSONFeed = (destination, posts, options) => {
	if (!("title" in options)) {
		log("Warning: `feed.JSON.title` not set in Soldfile, JSON Feed will not be generated");
		return;
	}

	if ("home_page_url" in options) {
		const home_page_url = options.home_page_url;

		// Add ending slash.
		if (home_page_url[home_page_url.length - 1] !== "/") {
			options.home_page_url += "/";
		}
	} else {
		log("Warning: `feed.JSON.home_page_url` not set in Soldfile, JSON Feed will not be generated");
		return;
	}

	const logDateInvalid = logOnce();

	const allPosts = Object.keys(posts)
		.reduce(
			(allPostsCurrent, section) => allPostsCurrent.concat(posts[section]),
			[]
		)
		.filter(post => !post.draft)
		.sort((item, next) => "order" in item ? item.order - next.order : 0);

	const feed = {
		version: "https://jsonfeed.org/version/1",
		title: options.title,
		home_page_url: options.home_page_url,
		feed_url: options.home_page_url + "feed.json",
		items: []
	};
	let feedLength = 0;

	for (let i = 0; i < allPosts.length; i++) {
		// Prevent the feed from growing too large by truncating it at around 256
		// kB. Note that this measures codepoint length instead of actual bytes; it
		// might end up quite a bit larger (if using a lot of high codepoints, for
		// example), but it should be a good heuristic regardless.
		if (feedLength > 256 * 1024) {
			break;
		}

		const post = allPosts[i];
		const item = {
			id: feed.home_page_url + post.file,
			url: feed.home_page_url + post.file,
			title: post.title,
			content_html: post.content
		};

		// Handle optional fields.
		if ("description" in post) {
			item.description = post.description;
		}

		if ("author" in post) {
			item.author = post.author;
		}

		if ("date" in post) {
			const timestamp = Date.parse(post.date);

			if (isNaN(timestamp)) {
				logDateInvalid(`Warning: some posts have dates that cannot be parsed; those won't appear in the JSON Feed (first encountered with ${post.file})`);
			} else {
				item.date_published = (new Date(timestamp)).toISOString();
			}
		}

		if ("tags" in post) {
			item.tags = post.tags;
		}

		feed.items.push(item);
		feedLength += JSON.stringify(item).length;
	}

	fs.writeFileSync(path.join(destination, "feed.json"), JSON.stringify(feed));
};

const Sold = (options) => {
	const root = options.root === undefined ? process.cwd() : options.root;

	const engine = options.engine === undefined ? "handlebars" : options.engine;
	const engineOptions = options.engineOptions;

	const template = path.join(root, options.template === undefined ? "template" : options.template);
	const templateIndex = fs.readFileSync(path.join(template, "index.html")).toString();
	const templatePost = fs.readFileSync(path.join(template, "post.html")).toString();

	const sourcePath = path.join(root, options.source === undefined ? "src" : options.source);
	const sourceSections = fs.readdirSync(sourcePath);

	const destinationName = options.destination === undefined ? "build" : options.destination;
	const destinationPath = path.join(root, destinationName);

	const feed = options.feed === undefined ? {} : options.feed;

	let posts = {};

	for (let i = 0; i < sourceSections.length; i++) {
		const section = sourceSections[i];
		const sectionPath = path.join(sourcePath, section);

		if (fs.lstatSync(sectionPath).isFile()) {
			continue;
		}

		const files = fs.readdirSync(sectionPath);
		const sectionPosts = [];

		for (let j = 0; j < files.length; j++) {
			const file = files[j];
			const fileParts = file.split(".");
			const fileExtenstion = fileParts.pop();

			if (markdownExtensions.indexOf(fileExtenstion) === -1) {
				continue;
			}

			const compiled = marked(fs.readFileSync(path.join(sectionPath, file)).toString());

			sectionPosts.push({
				section,
				file: fileParts.join(".") + ".html",
				posts,
				...compiled.meta,
				content: compiled.html
			});
		}

		if (sectionPosts[0].order !== undefined) {
			sectionPosts.sort((item, next) => item.order - next.order);
		}

		posts[section] = sectionPosts;

		for (let j = 0; j < sectionPosts.length; j++) {
			const sectionPost = sectionPosts[j];
			compile(path.join(destinationPath, section, sectionPost.file), templatePost, sectionPost, engine, engineOptions);
		}
	}

	for (const feedType in feed) {
		if (feedType === "JSON") {
			compileJSONFeed(destinationPath, posts, feed[feedType]);
		}
	}

	compile(path.join(destinationPath, "index.html"), templateIndex, posts, engine, engineOptions);

	log(`Built files in directory \x1b[33m"./${destinationName}"\x1b[0m ✨`);
};

module.exports = Sold;
