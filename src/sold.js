var fs = require('fs');
var marked = require('meta-marked');
var path = require('path');
var mkdirp = require('mkdirp');
var ncp = require('ncp');
var compiler = require("./compiler.js");
var log = require('./util.js').log;
var error = require("./util.js").error;

function Sold(dir) {
  if(!(this instanceof Sold)) {
    return new Sold(dir);
  }
  log("======= Sold =======", "blue");
  this.$directory = dir;
  this.$data = {};
  this.$source = "src";
  this.$destination = "build";
  this.$template = "template";


  return this;
}

Sold.prototype.engine = function(engine, opts) {
  compiler.set(engine, opts);
  return this;
}

Sold.prototype.data = function(data) {
  this.$data = data;
  return this;
}

Sold.prototype.source = function(dir) {
  this.$source = dir;
  return this;
}

Sold.prototype.destination = function(dir) {
  this.$destination = dir;
  return this;
}

Sold.prototype.template = function(dir) {
  this.$template = dir;
  return this;
}

const compile = function(content, template) {
  const info = marked(content);
  const html = info.html;
  const meta = info.meta;

  return {
    html: html,
    meta: meta
  }
};

Sold.prototype.build = function() {
  const templatePath = path.join(this.$directory, this.$template);
  const indexTemplatePath = path.join(templatePath, "index.html");
  const indexTemplate = fs.readFileSync(indexTemplatePath).toString();
  const postTemplatePath = path.join(templatePath, "post.html");
  const postTemplate = fs.readFileSync(postTemplatePath).toString();

  const sourcePath = path.join(this.$directory, this.$source);
  const subdirectories = fs.readdirSync(sourcePath);

  const destinationPath = path.join(this.$directory, this.$destination);

  let allMeta = [];

  for(var i = 0; i < subdirectories.length; i++) {
    const subdirectoryName = subdirectories[i];
    const subdirectorySourcePath = path.join(sourcePath, subdirectoryName);
    const subdirectoryDestinationPath = path.join(destinationPath, subdirectoryName);
    mkdirp.sync(subdirectoryDestinationPath);

    const sourceFiles = fs.readdirSync(subdirectorySourcePath);
    const destinationFiles = sourceFiles.map(function(item) {
      let trimmed = item.split('.');
      trimmed.pop();
      return trimmed.join('.') + '.html';
    });

    for(var j = 0; j < sourceFiles.length; j++) {
      const sourceFilePath = path.join(subdirectorySourcePath, sourceFiles[j]);
      const destinationFilePath = path.join(subdirectoryDestinationPath, destinationFiles[j]);

      const sourceFileContent = fs.readFileSync(sourceFilePath).toString();

      let {html, meta} = compile(sourceFileContent, postTemplate);
      meta["content"] = html;
      meta["section"] = subdirectoryName;
      meta["file"] = destinationFiles[j];
      allMeta.push(meta);

      fs.writeFileSync(destinationFilePath, compiler.compile(postTemplate, meta));
    }
  }

  allMeta = allMeta.sort(function(a, b) {
    return a["order"] - b["order"];
  });

  this.$data['posts'] = allMeta;
  fs.writeFileSync(path.join(destinationPath, 'index.html'), compiler.compile(indexTemplate, this.$data))

  return this;
}

module.exports = Sold;
