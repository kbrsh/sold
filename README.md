# Sold

A minimal static blog post generator

## Getting Started

Run this to install Sold
```sh
$ npm install -g sold
```

## Usage

1) Create instance of Sold in `soldconfig.js`
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
    .postSource("posts") // set the directory posts will be in (inside of the source directory) (default is posts)
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


## Demo

Websites running on Sold, submit an issue if you have one.

- [My Blog](http://blog.kabir.ml)


## License

Licensed under the [MIT License](http://kingpixil.github.io/license)
