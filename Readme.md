# channel

> Thing Comes in Here, Thing Comes out There

A **channel** is a two-sided event emitter with support for middleware. If you emit an event on the `a` side it will come out on the `b` side, and vice versa.

## Basic Usage

```javascript
var chan = channel();
chan.b.on('foo', function(thing) { console.log(thing) });
chan.a.emit('foo', 'thing');
```

Outputs:

```
thing
```

## Middleware and Data Transformation

![](https://i.cloudup.com/RT8a5tfItX.png)

Channels can operate on the data being transmitted through express-like middleware. 

```javascript
var chan = channel();

// uppercase middleware
chan.use(function(evt, next) {
  evt.args = evt.args.map(function(str) { return str.toUpperCase() });
  next();
});

chan.b.on('foo', function(thing) { console.log(thing) });
chan.a.emit('foo', 'thing');
```

Outputs:

```
THING
```

Middleware are executed asynchronously, so you can do interesting things like introducing latency or dropping events to simulate
adverse network conditions locally.

### Middleware parameters

#### The `evt` middleware parameter

`evt` contains the following properties:

* `source`: the source endpoint. you can check if the event came from `a` or `b`, by comparing this value with `this.a` and `this.b` inside the middleware.
* `name`: the event name
* `args`: the event args

#### The `next` middleware parameter

Just call `next()` to propagate the event to the next middleware in the chain, or to emit the event if you're the last middleware.

To drop an event, simply return without calling `next()`.

### Applications of Middleware

Here are some applications of channel middleware:

* Simulating latency
* Simulating packet loss
* Debouncing events
* Batching events
* Filtering events
* Encrypting/decrypting data
* Encoding/decoding data
* Compressing/decompressing data

## Piping in and out

You can use the `pipeIn()` and `pipeOut()` methods in the `a` and `b` endpoints to easily connect channels to event emitters, other channels or to something like [socket.io](https://socket.io).

This is useful, for example, for fanning in events from multiple sources into a single event emitter.

The `pipe()` method is also available when you want to simultaneously pipe events in and out.

## Installation

  Install with [component(1)](http://component.io):

    $ component install component/channel

## API

### The `channel()` function

Creates a new `Channel`.

### `Channel` Objects

#### The `Channel#a` property

The `a` `Endpoint` of the channel.

#### The `Channel#b` property

The `b` `Endpoint` of the channel.

#### The `Channel#use(middleware)` method

Use a middleware on this channel. `middleware` is a function, taking two parameters: `evt` and `next`.

### `Endpoint` Objects

#### The `Endpoint#emit(name, args...)` method

Emit an event with `name` and `args`. (It will fire on the other `Endpoint`, after going through the middleware);

#### The `Endpoint#on(name, fn)` method

Register `fn` as a handler function for event `name`.

#### The `Endpoint#pipeOut(name, target)` method

Pipe out `name` events into `target`. Target can be an Emitter, another Channel or anything that exposes an `emit()` method.

#### The `Endpoint#pipeIn(name, target)` method

Pipe in `name` events from `target`. Target can be an Emitter, another Channel or anything that exposes an `on()` method.

#### The `Endpoint#pipe(name, target)` method

Equivalent to calling both `pipeOut()` and `pipeIn()`.

## License

  The MIT License (MIT)

  Copyright (c) 2014 Automattic, Inc.

  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files (the "Software"), to deal
  in the Software without restriction, including without limitation the rights
  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  copies of the Software, and to permit persons to whom the Software is
  furnished to do so, subject to the following conditions:

  The above copyright notice and this permission notice shall be included in
  all copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
  THE SOFTWARE.
