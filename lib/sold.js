var fs = require('fs');
var marked = require('meta-marked');
var path = require('path');
var mkdirp = require('mkdirp');
var ncp = require('ncp').ncp;
var colors = require('./color.js');

function Sold(dir) {
    if (!(this instanceof Sold)) return new Sold(dir);
    console.log(colors.grey("Sold is building..."))
    this.data({});
    this._dir = dir;
    this.source("src");
    this.subSource("posts");
    this.destination('build');
    console.log(colors.green("Default Instace Initialized!"))
    console.log(colors.blue("Declaring Custom Settings.."))
}

Sold.prototype.source = function(path){
  console.log(colors.blue("Setting Source Path =>"))
  this._source = this._dir + "/" + path;
  console.log(colors.green("Source path set!"))
  return this;
};

Sold.prototype.subSource = function(path) {
    console.log(colors.blue("Setting Sub Source Path =>"))
    this._subSource = this._source + "/" + path;
    console.log(colors.green("Sub Source Path Set!"))
    return this;
}

Sold.prototype.destination = function(path){
  console.log(colors.blue("Setting Destination Path =>"))
  this._destination = this._dir + "/" + path;
  console.log(colors.green("Destination Path Set!"))
  return this;
};

Sold.prototype.data = function(data) {
    console.log(colors.blue("Adding Data =>"))
    this._data = data;
    this._blogTitle = this._data.title
    this._description = this._data.description
    console.log(colors.green("Data Added!"))
    return this;
}


Sold.prototype.build = function() {
    console.log(colors.blue("Building Files =>"))
    var template = fs.readFileSync("./template/index.html", "utf-8");
    var subSource = this._subSource;
    var blogTitle = this._blogTitle;
    var destination = this._destination;
    fs.readdir(subSource, function(err, files) {
        
        files.forEach(function(file) {
            
            var parsedData = marked(fs.readFileSync(subSource + "/" + file, "utf-8"));
            
            var newHTML = template.replace(/{{blog-title}}/g, blogTitle)
                                  .replace(/{{title}}/g, parsedData.meta.title)
                                  .replace(/{{description}}/g, parsedData.meta.description)
                                  .replace(/{{content}}/g, parsedData.html);
                                  
            var newPath = destination + "/" + subSource.split("/").slice(-1).pop() + "/" + file.split(".")[0] + "/" + "index.html"
            var folderPath = destination + "/" + subSource.split("/").slice(-1).pop() + "/" + file.split(".")[0];
                                  
                  
            mkdirp(folderPath, function() {
                mkdirp("")
                ncp("./template/assets/", folderPath, function() {
                   
                });
                fs.writeFile(newPath, newHTML, function(err) {
                    if (err) console.log(err); 
                });
            });            
            
            
        });
        
        
        if(err) console.log(err);
        
    });
    
    console.log(colors.green("Files have been built!"))
    
}


module.exports = Sold;