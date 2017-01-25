var fs = require('fs');
var marked = require('meta-marked');
var path = require('path');
var mkdirp = require('mkdirp');
var ncp = require('ncp').ncp;
var hexu = require('hexu');

function Sold(dir) {
    if (!(this instanceof Sold)) return new Sold(dir);
    this.directory = dir;
    this.data({});
    this.source("src");
    this.destination("build");
    this.template("template");
}

Sold.prototype.source = function(location) {
  this._source = path.join(this.directory, location);
  return this;
};

Sold.prototype.destination = function(location) {
  this._destination = Path.join(this.directory, location);
  return this;
};

Sold.prototype.data = function(data) {
  this._data = data;
  return this;
}


Sold.prototype.build = function() {
  
}


module.exports = Sold;
