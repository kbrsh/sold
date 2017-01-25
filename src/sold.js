var fs = require('fs');
var marked = require('meta-marked');
var path = require('path');
var mkdirp = require('mkdirp');
var ncp = require('ncp').ncp;
var hexu = require('hexu');

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
    this.destination("build");
    this.template("template");
    log("     success\n", "green");
}

Sold.prototype.source = function(location) {
  this._source = path.join(this.directory, location);
  return this;
};

Sold.prototype.destination = function(location) {
  this._destination = path.join(this.directory, location);
  return this;
};

Sold.prototype.template = function(location) {
  this._template = path.join(this.directory, location);
  return this;
};

Sold.prototype.data = function(data) {
  this._data = data;
  return this;
}


Sold.prototype.build = function() {
  log("  => building", "blue");
  ncp(this._source, this._destination, {
    transform: function(read, write) {
      read
        .pipe(write);
    }
  }, function(err) {
    if(err) {
      error("Could not build files");
    }
    log("     success\n", "green");
  });
}


module.exports = Sold;
