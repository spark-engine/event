# CHANGELOG

### 1.4.0 (2016-11-08)

- NEW: Now you can create your own stop/startable callbacks with `fn = event.callback.new( fn )`. Then fn.stop()/fn.start()

### 1.3.1 (2016-11-07)

- FIX: Firing a callback manager on a non-existent type fails gracefully.

### 1.3.0 (2016-11-04)

- NEW: Event managers (change, scroll, resize, etc) return callback references with the ability to
    disable/enable callback execution.
- NEW: A new callback manager makes it easy to group and trigger callbacks.
- NEW: `scroll.disablePointer` prevents jittery scrolling performance by disabling pointer events while scrolling.
- NEW: `resize.disableAnimation` prevents jittery resizing performance by disabling animations and transitions events while resizing.

### 1.2.0 (2016-11-03)

- NEW: Debounce can fire separate leading and trailing callbacks.
- NEW: Debounce accepts an object as the first arg for easier configuration.
- NEW: scrollStart, scrollStop, resizeStart, and resizeStop event managers, for debounced listening.
- NEW: Custom `scrollStart`, `scrollStop`, `resizeStart`, and `resizeStop` debounced and optimized events.

### 1.1.2 (2016-11-01)

- FIX: When trailing and leading, debounce no longer queues a trailing event on the first call.

### 1.1.1 (2016-11-01)

- FIX: Ensured form bubbling wouldn't be added twice.

### 1.1.0 (2016-11-01)

- NEW: timing functions, `delay` and `repeat`.
- NEW: throttling functions, `throttle` and `debounce`.
- NEW: form and input event bubbling with `bubbleFormEvents()`.
- NEW: Scroll event manager.
- NEW: Resize event manager.

### 1.0.0 (2016-04-12)

- Initial release
