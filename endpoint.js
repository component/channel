var Emitter = require('emitter');
var inherit = require('inherit');

function Endpoint(channel) {
  Emitter.call(this);

  this.channel = channel;
}

inherit(Endpoint, Emitter);

Endpoint.prototype._emit = Endpoint.prototype.emit;

Endpoint.prototype.emit = function(name) {
  var args = Array.prototype.slice.call(arguments, 1);
  var evt = { source: this, name: name, args: args };
  this.channel.propagate(evt);
}

Endpoint.prototype.pipeOut = function(name, target) {
  this.on(name, function() {
    var args = Array.prototype.slice.call(arguments, 0);
    target.emit.apply(target, [name].concat(args));
  });
}

Endpoint.prototype.pipeIn = function(name, target) {
  var self = this;
  target.on(name, function() {
    var args = Array.prototype.slice.call(arguments, 0);
    self.emit.apply(self, [name].concat(args));
  });
}

Endpoint.prototype.pipe = function(name, target) {
  this.pipeOut(name, target);
  this.pipeIn(name, target);
}

module.exports = Endpoint;
