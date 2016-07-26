var fs = require('fs');
var marked = require('marked');

function Sold(dir) {
    this.data({})
}

Sold.prototype.data = function(data) {
    this._data = data;
}

module.exports = Sold;