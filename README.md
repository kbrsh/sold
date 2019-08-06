# Sold

A minimal static blog generator.

## Getting Started

Run this to install Sold

```sh
$ npm install sold -g
```

## Usage

1) Create instance of Sold in `soldfile.js`
```js
const Sold = require("sold");

Sold({
  root: __dirname, // root folder (default is current working directory)
  template: "template", // template folder relative to root (default is "template")
  source: "src", // source folder relative to root (default is "src"),
  destination: "build", // destination folder relative to root (default is "build")
  engine: "handlebars", // template engine (default is "handlebars")
  engineOptions: {} // template engine options (default is {})
});
```

2) Create or download a template and put it in the `template` directory.

3) Create a folder called `src` (or whatever you named the source).

4) Inside, create another folder called `posts`, this is the directory your posts will be in.

5) To make a new post, make a markdown file, for example `post.md`. Put some metadata at the top to let Sold know of the title and description of the post, then put your content. For example:
```markdown
---
title: First Post
description: My very first post
---

Hey! This blog post was made with [Sold](https://github.com/kbrsh/sold).
```

6) Run
```sh
$ sold
```

7) Check out the generated files in the `build/` directory.

## Templates

A template should be in the file declared in the `template` option of an instance. Sold will, by default, search in the `template` directory.

#### `index.html`

This file should contain the home page. It will be provided all section names as values holding arrays of the posts in that section.

#### `post.html`

This file should contain the template used for each post. All contents of the metadata provided at the top of each post's markdown content is provided in a template here, and the HTML for the post is provided in `content`. The HTML code should be unescaped.

The subdirectory it was in will be provided in `section`, the file name will be provided in `file`, and a map of sections to post arrays will be provided in `posts`. If an `order` option is defined in the metadata, then the posts will be given in ascending order using the value.

```html
<h1>{{title}}</h1>

<p>{{section}}</p>
<p>{{file}}</p>

{{#posts.posts}}
	{{title}}
{{/posts.posts}}

{{{content}}}
```

#### Template Engine

Setting up a template engine can be done with the `engine` option, to setup an engine. Currently the supported engines are:

* Handlebars (default)
* EJS
* Pug

The `engine` option can also be a function that calls a callback with a result when given a template, data, and options.

```js
function engine(template, data, options, done) {
  configure(options);
  done(compile(template, data));
}
```

## JSON Feed

If you want to generate a JSON Feed for your blog-like site, add this to your Soldfile:

```js
Sold({
	// other options...
	feed: {
		JSON: {
			title: "My Awesome Blog", // the title shown in the feed
			home_page_url: "https://my.awesome.blog" // the HTTP(S) URL to where the site will reside
		}
	}
});
```

Note that your posts should have a parsable `date` metadata entry within the triple-dash block, like so:

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

Posts that have `draft: true` won't appear in the feed, and the feed will only contain only so many recent posts so that it doesn't exceed 256 KiB. Optional fields supported by the post include `description`, `author`, `date`, and `tags`.

The feed will be generated at `/feed.json`; you can add that to your index template, preferrably in the header like this:

```html
<link rel="alternate" type="application/json" title="JSON Feed" href="/feed.json"/>
```

## License

Licensed under the [MIT License](https://kbrsh.github.io/license)
