# Compose Event

This library wraps [bean](https://github.com/fat/bean) and [keymaster](https://github.com/madrobby/keymaster), adding a custom `tap` event cross-browser support for animation events.

Usage is nearly identical to Bean's and Keymasters since this is intended to be as transparent a wrapper as possible. Here are some examples.

```
event = require('compose-event')

// simple
event.on(element, 'click', handler);

// optional arguments passed to handler
event.on(element, 'click', function(e, o1, o2) {
  console.log(o1, o2);
}, optional, args);

// multiple events
event.on(element, 'keydown keyup', handler);

// multiple handlers
event.on(element, {
  click: function (e) {},
  mouseover: function (e) {},
  'focus blur': function (e) {}
});
```
