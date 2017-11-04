const marked = require("meta-marked");
const fs = require("fs");
const path = require("path");

const compilers = {
  ejs: (template, data, options, done) => {
    done(require("ejs").render(template, data, options));
  },
  handlebars: (template, data, options, done) => {
    const Handlebars = require("handlebars");
    if(options !== undefined) {
      options(Handlebars);
    }
    done(Handlebars.compile(template)(data));
  },
  pug: (template, data, options, done) => {
    done(require("pug").compile(template, options)(data));
  }
}

const compile = (destination, template, data, engine, options) => {
  if(typeof engine === "function") {
    engine(template, data, options, (result) => {
      fs.writeFileSync(destination, result);
    });
  } else {
    compilers[engine.toLowerCase()](template, data, options, (result) => {
      fs.writeFileSync(destination, result);
    });
  }
}

const Sold = (options) => {
  const root = options.root === undefined ? process.cwd() : options.root;

  const template = path.join(root, options.template === undefined ? "template" : options.template);
  const indexTemplate = fs.readFileSync(path.join(template, "index.html")).toString();
  const postTemplate = fs.readFileSync(path.join(template, "post.html")).toString();

  const engine = options.engine === undefined ? "handlebars" : options.engine;
  const engineOptions = options.engineOptions;

  const sourcePath = path.join(root, options.source === undefined ? "src" : options.source);
  const sourceDirectories = fs.readdirSync(sourcePath);

  const destinationName = options.destination === undefined ? "build" : options.destination;
  const destinationPath = path.join(root, destinationName);

  let posts = {};

  for(let i = 0; i < sourceDirectories.length; i++) {
    const directoryName = sourceDirectories[i];
    const directoryPath = path.join(sourcePath, directoryName);

    const files = fs.readdirSync(directoryPath);
    const sectionPosts = [];

    for(let j = 0; j < files.length; j++) {
      let fileName = files[j];
      const compiled = marked(fs.readFileSync(path.join(directoryPath, fileName)).toString());

      fileName = fileName.split(".");
      fileName.pop();
      fileName = fileName.join(".") + ".html";

      sectionPosts.push({
        section: directoryName,
        file: fileName,
        ...compiled.meta,
        content: compiled.html
      });
    }

    if(sectionPosts[0].order !== undefined) {
      sectionPosts.sort((item, next) => item.order - next.order);
    }

    posts[directoryName] = sectionPosts;

    for(let j = 0; j < sectionPosts.length; j++) {
      const sectionPost = sectionPosts[j];
      compile(path.join(destinationPath, directoryName, sectionPost.file), postTemplate, sectionPost, engine, engineOptions);
    }
  }

  fs.writeFileSync(path.join(destinationPath, "index.html"), compile(indexTemplate, {data: posts}, engine, engineOptions));

  console.log(`\x1b[34m sold\x1b[0m Built files in directory \x1b[33m"./${destinationName}"\x1b[0m ✨`);
}

module.exports = Sold;
