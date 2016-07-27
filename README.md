# Sold

A minimal static blog post generator

## Getting Started

Run this to install Sold
```sh
$ npm install -g sold
```

## Usage

Simple Example

1) Create instance of sold in an `soldconfig.js`
```js
var Sold = require('sold')

Sold(__dirname) // create new instance in root directory
    .data({
        title: "My Title",
        description: "Post Description"
    }) // set custom data for blog
    .source("src") // set the source for where the markdown files are stored (default is src)
    .destination("build") // set destination path for build files (default is build)
    .build() // build when everything is done
```

2) Then, create a folder called `src` (or whatever you named the source)

3) Inside, create another folder called `posts`, this is the directory your posts will be in

4) To make a new post, simply make a markdown file, for example `post.md`

Put some metadata at the top to let Sold know of the title and description of the post, then put your content. For example:
```markdown
---
title: My First Post
description: This is my very first post
---

Hello everyone, here is my first blog post I am making. How did I make it? With [Sold](https://github.com/KingPixil/sold) :)
```

5) Run the `soldconfig.js` file like this:

```sh
$ node soldconfig.js
```

6) Check out the files generated for you in the `build/` directory