const compilers = {
  ejs: function(template, data, opts) {
    return require('ejs').render(template, data, opts)
  },
  handlebars: function(template, data, opts) {
    const Handlebars = require('handlebars');
    if(opts !== undefined) {
      opts(Handlebars);
    }
    return Handlebars.compile(template)(data);
  },
  pug: function(template, data, opts) {
    return require('pug').compile(template, opts)(data);
  }
}

module.exports = {
  compile: function(template, data) {
    return compilers[this.engine](template, data, this.opts);
  },
  set: function(type, opts) {
    this.opts = opts;
    this.engine = type;
  },
  opts: function() {},
  engine: "handlebars"
}
