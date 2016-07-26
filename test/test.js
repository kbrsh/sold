var Sold = require("../index.js");

Sold(__dirname)
    .data({
       title: "Blog Title!",
       description: "This is my blog made with Sold"
    })
    .build();