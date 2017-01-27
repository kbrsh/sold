var fs = require('fs');
var marked = require('meta-marked');
var path = require('path');
var mkdirp = require('mkdirp');
var hexu = require('hexu');
var ncp = require('ncp');

var log = function(msg, color) {
  console.log(hexu[color](msg));
}

var error = function(msg) {
  throw new Error("[Sold] ERR: " + msg);
}

function Sold(dir) {
    if (!(this instanceof Sold)) return new Sold(dir);
    log("======= Sold =======", "blue");
    log("  => intializing", "blue");
    this.directory = dir;
    this.data({});
    this.source("src");
    this.postSource("posts");
    this.destination("build");
    this.template("template");
    log("     success\n", "green");
}

Sold.prototype.postSource = function(location) {
  this._postSource = path.join(this._source, location);
  this._postSourcePath = location;
  return this;
};

Sold.prototype.source = function(location) {
  this._source = path.join(this.directory, location);
  return this;
};

Sold.prototype.destination = function(location) {
  this._destination = path.join(this.directory, location);
  this._postDestination = path.join(this._destination, this._postSourcePath)
  return this;
};

Sold.prototype.template = function(location) {
  this._template = path.join(this.directory, location);
  this._homeTemplate = path.join(this.directory, location, "index.html");
  this._postTemplate = path.join(this.directory, location, "post.html");
  return this;
};

Sold.prototype.data = function(data) {
  this._data = data;
  return this;
}


Sold.prototype.build = function() {
  log("  => building", "blue");
  var destination = this._postDestination;
  var rootDestination = this._destination;
  var source = this._postSource;
  var rootSource = this._source;
  var data = this._data;
  var postTemplate = fs.readFileSync(this._postTemplate).toString();
  var postTemplatePath = this._postTemplate;
  var homeTemplate = fs.readFileSync(this._homeTemplate).toString();
  var homeTemplatePath = this._homeTemplate;
  var template = this._template;
  mkdirp(destination, (err) => {
    if(err) {
      error("Could not create \"" + destination + "\" Directory");
    }

    fs.readdir(source, (err, files) => {
      for(var i = 0; i < files.length; i++) {
        var file = files[i];
        fs.readFile(path.join(source, file), (err, data) => {
          if(err) {
            error("Could not read file: \"" + files[i] + "\"");
          }
          var postData = postTemplate;
          var compiled = marked(data.toString());
          var metadata = compiled.meta;
          var html = compiled.html;
          metadata["title"] = metadata.title;
          metadata["author"] = metadata.author;
          metadata["description"] = metadata.description;
          metadata["content"] = html;
          for(var key in metadata) {
            var re = new RegExp("{{post-" + key + "}}", 'gi');
            postData = postData.replace(re, metadata[key]);
          }
          var destinationFile = file.split(".")
          destinationFile.pop();
          destinationFile = destinationFile.join(".") + ".html";
          fs.writeFile(path.join(destination, destinationFile), postData);
        });
      }
    });

    var compiledHomeTemplate = homeTemplate;
    for(var key in data) {
      var re = new RegExp("{{blog-" + key + "}}", 'gi');
      compiledHomeTemplate = compiledHomeTemplate.replace(re, data[key]);
    }
    fs.writeFile(path.join(this._destination, "index.html"), compiledHomeTemplate);

    ncp(template, rootDestination, {
      filter: function(fileName) {
        return (fileName !== homeTemplatePath) && (fileName !== postTemplatePath);
      }
    }, function (err) {
      if(err) {
        error("Could not build assets");
      }
    });

  });
  log("     success\n", "green");
}


module.exports = Sold;
