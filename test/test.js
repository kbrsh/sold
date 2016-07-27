var Sold = require("../index.js");

Sold(__dirname)
    .data({
       title: "Sold Blog",
       description: "This is my blog made with Sold",
       author: "Kabir Shah"
    })
    .build();