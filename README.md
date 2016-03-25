# Compose Event

This library wraps [bean](https://github.com/fat/bean) and [keymaster](https://github.com/madrobby/keymaster), adding a custom `tap` event cross-browser support for animation events.

Usage is nearly identical to Bean's and Keymasters since this is intended to be as transparent a wrapper as possible. Here are some examples.

```
event = require('compose-event')

event.on(element, 'click', handler)
```
