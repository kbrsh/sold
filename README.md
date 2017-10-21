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
  destination: "build" // destination folder relative to root (default is "build")
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

##### `index.html`

This file should contain the home page. It will be provided with a map called `data` with keys of each section, and values of an array of the posts inside.

##### `post.html`

This file should contain the template used for each post. All contents of the metadata provided at the top of each post's markdown content is provided in a template here, and the HTML for the post is provided in `content`. The HTML code should be accessed with a triple mustache, to be unescaped.

The subdirectory it was in will be provided in `section`, and the file name will be provided in `file`. If an `order` option is defined in the metadata, then the posts will be given in ascending order using the value.

```html
<h1>{{title}}</h1>

<p>{{section}}</p>
<p>{{file}}</p>

{{{content}}}
```

##### Template Engine

Setting up a template engine can be done with the `engine` option, to setup an engine. Currently the supported engines are:

* Handlebars (default)
* EJS
* Pug

## License

Licensed under the [MIT License](http://kbrsh.github.io/license)
