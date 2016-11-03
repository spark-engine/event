# CHANGELOG

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
