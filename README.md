# Sold

A minimal static blog post generator

## Getting Started

Run this to install Sold
```sh
$ npm install sold -g
```

## Usage

1) Create instance of Sold in `soldfile.js`
```js
var Sold = require('sold')

Sold(__dirname) // create new instance in root directory
    .data({
        title: "My Title", // add metadata
        description: "Post Description",
        author: "John Doe"
    }) // set custom data for blog
    .template("template") // set location for the template
    .source("src") // set the source for where the markdown files are stored (default is src)
    .destination("build") // set destination path for build files (default is build)
    .build() // build when everything is done
```

2) Create or download a template and put it in the `template` directory

3) Then, create a folder called `src` (or whatever you named the source)

4) Inside, create another folder called `posts`, this is the directory your posts will be in

5) To make a new post, simply make a markdown file, for example `post.md`

Put some metadata at the top to let Sold know of the title and description of the post, then put your content. For example:
```markdown
---
title: My First Post
description: This is my very first post
---

Hello everyone, here is my first blog post I am making. Made with [Sold](https://github.com/KingPixil/sold)
```

6) Run

```sh
$ sold
```

6) Check out the files generated for you in the `build/` directory

## Templates

A template should be in the file declared in the `.template` method of an instance. Sold will by default, search in the `template` directory.

##### `index.html`

This file should contain the homepage, and use mustache templates. All data set during initialization in the `data` option will be available here using templates like: `{{item}}`

All posts and their metadata (included in YAML at the top of each post) will be provided in `posts`, you can iterate through them like this:

```html
{{#posts}}
{{title}}
{{/posts}}
```

The `{{title}}` refers to each post's title metadata.

##### ```post.html```

This file should contain the template used for each post, and can link to any other assets inside the template. All contents of the metadata provided at the top of each post's markdown content is provided in a template here, and the HTML for the post is provided in `content`. The HTML code should be accessed with a triple mustache, to be unescaped. The subdirectory it was in will be provided in `section`.

```html
<h1>{{title}}</h1>
{{{content}}}
```

##### Other assets

Any other assets will be copied over to the build directory.

##### Template Engine

Setting up a template engine can be done with the `engine` method, to setup an engine. Currently the supported engines are:

* Handlebars (default)
* EJS
* Pug


## Demo

Websites running on Sold, submit an issue if you have one.

- [My Blog](http://blog.kabir.ml)


## License

Licensed under the [MIT License](http://kingpixil.github.io/license)
