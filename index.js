const fm = require("front-matter");
const marked = require("marked");
const ejs = require("ejs");
const fs = require("fs");
const path = require("path");

const markdownExtensions = [".markdown", ".mdown", ".mkdn", ".mkd", ".md"];

const log = message => {
	console.log(`\x1b[34msold\x1b[0m ${message}`);
};

const logError = message => {
	console.log(`\x1b[31merror\x1b[0m ${message}`);
};

const logErrorOnce = () => {
	let logged = false;

	return message => {
		if (logged === false) {
			logError(message);
			logged = true;
		}
	};
};

const compileFeedJSON = (feed, posts, destinationPath) => {
	if (!("title" in feed)) {
		logError(`Missing JSON feed title.

Attempted to compile JSON feed.

Received undefined value for \`feed.JSON.title\`.

Expected \`feed.JSON.title\` to be defined.`);
	}

	if ("home_page_url" in feed) {
		const home_page_url = feed.home_page_url;

		// Add ending slash.
		if (home_page_url[home_page_url.length - 1] !== "/") {
			feed.home_page_url += "/";
		}
	} else {
		logError(`Missing JSON feed home page URL.

Attempted to compile JSON feed.

Received undefined value for \`feed.JSON.home_page_url\`.

Expected \`feed.JSON.home_page_url\` to be defined.`);
	}

	const logDateInvalid = logErrorOnce();
	let feedLength = 0;
	feed.version = "https://jsonfeed.org/version/1";
	feed.feed_url = feed.home_page_url + "feed.json";
	feed.items = [];
	posts = posts.filter(post => !post.draft);

	for (let i = 0; i < posts.length; i++) {
		const post = posts[i];
		const item = {
			id: feed.home_page_url + post.file + ".html",
			url: feed.home_page_url + post.file + ".html",
			content_html: post.content
		};

		// Handle optional fields.
		if ("title" in post) {
			item.title = post.title;
		}

		if ("summary" in post) {
			item.summary = post.summary;
		}

		if ("image" in post) {
			item.image = post.image;
		}

		if ("author" in post) {
			item.author = post.author;
		}

		if ("date" in post) {
			const timestamp = Date.parse(post.date);

			if (isNaN(timestamp)) {
				logDateInvalid(`Some posts with invalid date.

Attempted to compile post items for JSON feed.

Received invalid date:
	${post.date}

	First encountered in file:
		${post.file}

Expected valid date.`);
			} else {
				item.date_published = (new Date(timestamp)).toISOString();
			}
		}

		if ("tags" in post) {
			item.tags = post.tags;
		}

		feed.items.push(item);
		feedLength += JSON.stringify(item).length;

		// Prevent the feed from growing too large by truncating it at around 256
		// kB. Note that this measures codepoint length instead of actual bytes;
		// it might end up quite a bit larger (if using a lot of high codepoints,
		// for example), but it should be a good heuristic regardless.
		if (feedLength > 256 * 1024) {
			break;
		}
	}

	fs.writeFileSync(path.join(destinationPath, "feed.json"), JSON.stringify(feed));
};

const Sold = options => {
	const root = "root" in options ? options.root : process.cwd();
	const templatePath = path.join(root, "template" in options ? options.template : "template");
	const templateIndex = fs.readFileSync(path.join(templatePath, "index.html"), "utf8");
	const templatePost = fs.readFileSync(path.join(templatePath, "post.html"), "utf8");
	const sourcePath = path.join(root, "source" in options ? options.source : "src");
	const sourceFiles = fs.readdirSync(sourcePath);
	const destinationName = "destination" in options ? options.destination : "dist";
	const destinationPath = path.join(root, destinationName);
	const feed = "feed" in options ? options.feed : {};
	const posts = [];

	marked.setOptions("marked" in options ? options.marked : {});

	for (let i = 0; i < sourceFiles.length; i++) {
		const sourceFile = sourceFiles[i];
		const sourceFileExtension = path.extname(sourceFile);

		if (markdownExtensions.indexOf(sourceFileExtension) !== -1) {
			const meta = fm(fs.readFileSync(path.join(sourcePath, sourceFile), "utf8"));

			posts.push({
				file: path.basename(sourceFile, sourceFileExtension),
				content: marked(meta.body),
				...meta.attributes
			});
		}
	}

	if (posts[0].order !== undefined) {
		posts.sort((item, next) => item.order - next.order);
	} else if (posts[0].date !== undefined) {
		posts.sort((item, next) => Date.parse(next.date) - Date.parse(item.date));
	}

	fs.writeFileSync(
		path.join(destinationPath, "index.html"),
		ejs.render(templateIndex, {
			options,
			posts
		})
	);

	for (let i = 0; i < posts.length; i++) {
		const post = posts[i];

		fs.writeFileSync(
			path.join(destinationPath, post.file + ".html"),
			ejs.render(templatePost, {
				options,
				post,
				posts
			})
		);
	}

	for (const feedType in feed) {
		if (feedType === "JSON") {
			compileFeedJSON(feed[feedType], posts, destinationPath);
		}
	}

	log(`Built files in directory \x1b[33m${destinationName}\x1b[0m`);
};

module.exports = Sold;
