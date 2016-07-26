var fs = require('fs');
var marked = require('meta-marked');


function Sold(dir) {
    this.data({})
    this.source('src');
    this.destination('build');
}

Sold.prototype.source = function(path){
  this._source = path;
  return this;
};

Sold.prototype.destination = function(path){
  this._destination = path;
  return this;
};

Sold.prototype.data = function(data) {
    this._data = data;
    this._blogTitle = this._data.title
    this._description = this._data.description
}


Sold.prototype.build = function() {
    
}

module.exports = Sold;