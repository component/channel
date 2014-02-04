var Endpoint = require('./endpoint');

function Channel() {
  if (!(this instanceof Channel)) {
    return new Channel();
  }
  this.a = new Endpoint(this);
  this.b = new Endpoint(this);
  this.middleware = [];
}

Channel.prototype.use = function(middleware) {
  this.middleware.push(middleware);
}

Channel.prototype.propagate = function(evt) {
  var self = this;
  var i = 0;
  function step() {
    if (i >= self.middleware.length) {
      done();
    } else {
      self.middleware[i].call(self, evt, next);
      i++;
    }
  }
  function next() {
    if (typeof setImmediate != 'undefined') {
      setImmediate(step);
    } else {
      setTimeout(step, 0);
    }
  }
  function done() {
    if (evt.source === self.a) {
      self.b._emit.apply(self.b, [evt.name].concat(evt.args));
    } else {
      self.a._emit.apply(self.a, [evt.name].concat(evt.args));
    }
  }
  next();
}

module.exports = Channel;
