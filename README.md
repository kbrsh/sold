# Sold

A minimal static blog generator.

## Getting Started

Run this to install Sold

```sh
$ npm install sold -g
```

## Usage

1) Create instance of Sold in `sold.config.js`
```js
const Sold = require("sold");

Sold({
	root: __dirname, // root folder (default is current working directory)
	template: "template", // template folder relative to root (default is "template")
	source: "src", // source folder relative to root (default is "src")
	destination: "dist", // destination folder relative to root (default is "dist")
	feed: {}, // feed options (default is `{}`)
	marked: {} // marked options (default is `{}`)
});
```

2) Create or download a template and put it in the `template` directory.

3) Create a folder called `src` (or whatever you named the source).

4) To make a new post, make a markdown file, for example `post.md` in the source folder. Put some metadata at the top to let Sold know of the title and description of the post, then put your content. For example:
```markdown
---
title: First Post
description: My very first post
---

Hey! This blog post was made with [Sold](https://github.com/kbrsh/sold).
```

5) Run
```sh
$ sold
```

6) Check out the generated files in the `dist` directory.

## Templates

A template should be in the file declared in the `template` option of an instance. Sold will, by default, search in the `template` directory. They support [EJS](https://ejs.co) syntax.

#### `index.html`

This file should contain the home page. It will be provided the following:

```js
{
	options: {}, // options provided to `Sold`
	posts: [] // list of posts
}
```

#### `post.html`

This file should contain the template used for each post. All contents of the metadata provided at the top of each post's markdown content is provided in a template here, and the HTML for the post is provided in `content`. The HTML code should be unescaped. It will be provided the following:

```js
{
	options: {}, // options provided to `Sold`
	post: {
		file: "", // base name of file (without extensions)
		content: "", // HTML content of compiled markdown
		...meta // metadata in front-matter of markdown file
	},
	posts: [] // list of all posts
}
```

If an `order` option is defined in the metadata, then the posts will be given in ascending order using the value. If there is a `date` option and no `order`, the posts will be ordered in descending order using the date (most recent first).

For example:

```html
<h1><%= post.title %></h1>
<h3><%= post.description %></h3>
<p><%= post.file %></p>

<% posts.forEach(post => { %>
	<%= post.title %>
<% }); %>

<%- post.content %>
```

## JSON Feed

If you want to generate a JSON Feed for your blog-like site, add this to your configuration:

```js
Sold({
	feed: {
		JSON: {
			title: "My Awesome Blog", // the title shown in the feed
			home_page_url: "https://my.awesome.blog" // the HTTP(S) URL to where the site will reside
		}
	}
});
```

A post can look like this:

```markdown
---
title: First Post
date: 2019-08-01 12:00 PST
description: My very first post
author:
   name: John Doe
   url: https://example.com
tags:
   - first
   - sold
---

Hey! This blog post was made with [Sold](https://github.com/kbrsh/sold).
```

Posts that have `draft: true` won't appear in the feed, and the feed will only contain only so many recent posts so that it doesn't exceed 256 KiB. Optional fields supported by the post include `title`, `summary`, `image`, `author`, `date`, and `tags`.

Note that the `date` metadata entry must be valid input to `Date.parse`. Posts are ordered by the `order` property if it is present, or else they are sorted by `date`. If neither are present, then they are not sorted at all.

The feed will be generated at `/feed.json`; you can add that to your index template, preferrably in the header like this:

```html
<link rel="alternate" type="application/json" title="JSON Feed" href="/feed.json"/>
```

## License

Licensed under the [MIT License](https://license.kabir.sh) by [Kabir Shah](https://kabir.sh)
