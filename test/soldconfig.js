var Sold = require("../index.js");

Sold(__dirname) // create new instance in root directory
    .data({
        title: "Test Title",
        description: "Test Description",
        author: "Kabir Shah"
    }) // set custom data for blog
    .source("src") // set the source for where the markdown files are stored (default is src)
    .destination("build") // set destination path for build files (default is build)
    .build() // build when everything is done
