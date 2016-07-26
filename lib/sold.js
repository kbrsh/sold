var fs = require('fs');
var marked = require('meta-marked');


function Sold(dir) {
    if (!(this instanceof Sold)) return new Sold(dir);
    this.data({});
    this._dir = dir;
    this.source("src");
    this.subSource("posts");
    this.destination('build');
}

Sold.prototype.source = function(path){
  this._source = this._dir + "/" + path;
  return this;
};

Sold.prototype.subSource = function(path) {
    this._subSource = this._source + "/" + path;
    return this;
}

Sold.prototype.destination = function(path){
  this._destination = this._dir + "/" + path;
  return this;
};

Sold.prototype.data = function(data) {
    this._data = data;
    this._blogTitle = this._data.title
    this._description = this._data.description
    return this;
}


Sold.prototype.build = function() {
    var template = fs.readFileSync("./template/index.html", "utf-8");
    var subSource = this._subSource;
    var destination = this._destination;
    fs.readdir(subSource, function(err, files) {
        
        files.forEach(function(file) {
            
            var parsedData = marked(fs.readFileSync(subSource + "/" + file, "utf-8"));
            
            var newHTML = template.replace(/{{blog-title}}/g, this._blogTitle)
                                  .replace(/{{title}}/, parsedData.meta.title);
                                  
                                  
            fs.writeFile(destination + "/" + file.split(".")[0] + ".html", newHTML, function(err) {
                if (err) console.log(err); 
            });
            
            
        });
        
        
        if(err) console.log(err);
        
    });
    
}

module.exports = Sold;