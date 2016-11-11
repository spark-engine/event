# CHANGELOG

### 1.6.3 (2016-11-11)

- FIX: Form event bubbling now happens in the DOM using CustomEvents.

### 1.6.2 (2016-11-11)

- FIX: Event.ready now properly calls event.change on first load.

### 1.6.1 (2016-11-11)

- FIX: Optimized scroll managers now return the correct object.

### 1.6.0 (2016-11-10)

- NEW: Easily register media query events, `event.media.width`, `event.media.minWidth`, etc.
- FIX: Scroll and resize event managers should always fire stop callbacks.
- CHANGE: Event Manager access has changed for resize and scroll: 
  - event.resizeStart -> event.resize.start
  - event.resizeStop  -> event.resize.stop
  - event.scrollStart -> event.scroll.start
  - event.scrollStop  -> event.scroll.stop

### 1.5.0 (2016-11-09)

- NEW: Added `toggle( [bool] )` function to callbacks and callback managers.

### 1.4.2 (2016-11-08)

- FIX: Restored `resize.disableAnimation()` feature.

### 1.4.1 (2016-11-08)

- FIX: Fixed refactor artifacts

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
