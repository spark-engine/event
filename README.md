# Compose Event

This is a unified events framework handling standard events, keyboard events,
cross-browser animation events, and tap events (for touch screen devices).

- Easy DOM event management, powered by [bean](https://github.com/fat/bean).
- Cross-browser animation events.
- Custom `tap` event for properly discerning touch events.
- Simple keyboard events, powered by [keymaster](https://github.com/madrobby/keymaster).

If you want to trigger events on DOM ready, or when a page changes, use these
to register your functions.

- <a href="#ready">event.<code>ready()</code></a>
- <a href="#change">event.<code>change()</code></a>

For DOM and keyboard events use these.

- <a href="#on">event.<code>on()</code></a>
- <a href="#one">event.<code>one()</code></a>
- <a href="#off">event.<code>off()</code></a>
- <a href="#clone">event.<code>clone()</code></a>
- <a href="#fire">event.<code>fire()</code></a>
- <a href="#keyon">event.<code>keyOn()</code></a>
- <a href="#keyoff">event.<code>keyOff()</code></a>
- <a href="#keyOne">event.<code>keyOne()</code></a>
- <a href="#key">event.<code>key</code></a>

Much of the documentation below has been copied from dependent libraries and modified where necessary. To dig deeper be sure to reference
the documentation for [bean](https://github.com/fat/bean) and [keymaster](https://github.com/madrobby/keymaster).

<a name="on"></a>
### on(element, eventType[, selector], handler[, args ])
<code>bean.on()</code> lets you attach event listeners to both elements and objects.

**Arguments**

- **element / object** (DOM Element or Object) - an HTML DOM element or any JavaScript Object
- **event type(s)** (String) - an event (or multiple events, space separated) to listen to
- **selector** (optional String) - a CSS DOM Element selector string to bind the listener to child elements matching the selector
- **handler** (Function) - the callback function
- **args** (optional) - additional arguments to pas to the callback function when triggered

Optionally, event types and handlers can be passed in an object of the form `{ 'eventType': handler }` as the second argument.

**Examples**

```js
event = require('compose-event')

// simple
event.on(element, 'click', handler);

// optional arguments passed to handler
event.on(element, 'click', function(event, o1, o2) {
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

**Delegation**

```js
// event delegated events
event.on(element, 'click', '.content p', handler);

// Alternatively, you can pass an array of elements.
// This cuts down on selector engine work, and is a more performant means of
// delegation if you know your DOM won't be changing:
event.on(element, [el, el2, el3], 'click', handler);
event.on(element, document.querySelectorAll('.myClass'), 'click', handler);
```

**Differences to Bean events**

Even though with Bean (the core of the events system) using an object to register multiple events at once means
you cannot have cannot have delegation or optional arguments, compose-event processes
arguments to allow these features without issue. Here's what that looks like.

```js
// Multiple events + delegation + optional arguments
event.on(element, {
  click: function (e) {},
  mouseover: function (e) {},
  'focus blur': function (e) {}
}, '.content p', 'optional', 'argument');
```

Another difference is that you can create a new 'tap' event which looks like this.

```js
event.on(element, 'tap', function() {})
```

This attaches a `touchstart` event and watches for movement or additional fingers, which would indicate a canceled or uninteneded tap. If a
user does not move their finger or add an additional finger, their intent is determined as a tap, and the callback function is executed.

**Note:** Remember to stop propagation on a tap event if you do not want it to also fire a click event, since mobile devices typically fire
a click event a part of the touch event lifecycle.

<a name="one"></a>
### one(element, eventType[, selector], handler[, args ])
<code>event.one()</code> is an alias for <code>event.on()</code> except that the handler will only be executed once and then the listener
will be removed. If you use `one` for multiple events, the listener will be removed as each event is fired.

<a name="off"></a>
### off(element[, eventType[, handler ]])
<code>event.off()</code> is how you get rid of handlers once you no longer want them active. It's also a good idea to call *off* on elements before removing them from your DOM; this helps prevent memory leaks.

**Arguments**

- **element / object** (DOM Element or Object) - an HTML DOM element or any JavaScript Object
- **event type(s)** (optional String) - an event (or multiple events, space separated) to remove
- **handler** (optional Function) - the specific callback function to remove

Optionally, event types and handlers can be passed in an object of the form `{ 'eventType': handler }` as the second argument, just like `on()`.

**Examples**

```js
// remove a single event handlers
event.off(element, 'click', handler);

// remove all click handlers
event.off(element, 'click');

// remove handler for all events
event.off(element, handler);

// remove multiple events
event.off(element, 'mousedown mouseup');

// remove all events
event.off(element);

// remove handlers for events using object literal
event.off(element, { click: clickHandler, keyup: keyupHandler })
```

<a name="clone"></a>
### clone(destElement, srcElement[, eventType ])
<code>event.clone()</code> is a method for cloning events from one DOM element or object to another.

**Examples**

```js
// clone all events at once by doing this:
event.clone(toElement, fromElement);

// clone events of a specific type
event.clone(toElement, fromElement, 'click');
```

--------------------------------------------------------
<a name="fire"></a>
### fire(element, eventType[, args ])
<code>event.fire()</code> gives you the ability to trigger events.

**Examples**

```js
// fire a single event on an element
event.fire(element, 'click');

// fire multiple types
event.fire(element, 'mousedown mouseup');
```

## The `Event` object

Bean implements a variant of the standard DOM `Event` object, supplied as the argument to your DOM event handler functions. Bean wraps and *fixes* the native `Event` object where required, providing a consistent interface across browsers.

```js
// prevent default behavior and propagation (even works on old IE)
event.on(el, 'click', function (event) {
  event.preventDefault();
  event.stopPropagation();
});

// a simple shortcut version of the above code
event.on(el, 'click', function (event) {
  event.stop();
});

// prevent all subsequent handlers from being triggered for this particular event
event.on(el, 'click', function (event) {
  event.stopImmediatePropagation();
});
```

**Note:** Your mileage with the `Event` methods (`preventDefault` etc.) may vary with delegated events as the events are not intercepted at the element in question.

## object support

Everything you can do with an element, you can also do with an object. this is particularly useful for working with classes or plugins.

```js
var inst = new klass();
event.on(inst, 'complete', handler);

//later on...
event.fire(inst, 'complete');
```

## Keybaord events

<a name="keyon"></a>
### keyOn('key', handler)
<code>event.keyOn()</code> gives you the ability to trigger events from keypresses.

**Examples**

```js
// simple
event.keyOn('a', function(){ alert('you pressed a!') });

// You can also chain modifier keys and stop events like this.
event.keyOn('ctrl+r', function(){ alert('stopped reload!'); return false });

// multiple shortcuts that do the same thing
event.keyOn('⌘+r, ctrl+r', function(){ });
```

The handler method is called with two arguments set, the keydown `event` fired, and
an object containing, among others, the following two properties:

`shortcut`: a string that contains the shortcut used, e.g. `ctrl+r`
`scope`: a string describing the scope (or `all`)

```js
event.keyOn('⌘+r, ctrl+r', function(event, handler){
  console.log(handler.shortcut, handler.scope);
});

// "ctrl+r", "all"
```

## Special Key support

Supported modifier keys:
`⇧`, `shift`, `option`, `⌥`, `alt`, `ctrl`, `control`, `command`, and `⌘`.

The following special keys can be used for shortcuts:
`backspace`, `tab`, `clear`, `enter`, `return`, `esc`, `escape`, `space`,
`up`, `down`, `left`, `right`, `home`, `end`, `pageup`, `pagedown`, `del`, `delete`
and `f1` through `f19`.

<a name="keyone"></a>
### keyOne('key', handler)
<code>event.keyOne()</code> is an alias for `key()` but it fires once and removes its listener.

This will execute the callback and stop listening for the escape key.

```js
// simple
event.keyOne('esc', function(){ alert('Escaping!') });
```

<a name="keyoff"></a>
### keyOff('key', handler)
<code>event.keyOff()</code> removes event listeners for keys.

```javascript
// unbind 'a' handler
key.unbind('a');

// unbind a key only for a single scope
// when no scope is specified it defaults to the current scope (key.getScope())
key.unbind('o, enter', 'issues');
key.unbind('o, enter', 'files');
```


<a name="key"></a>
### key
<code>event.key</code> gives you access to the key object for querying key states and managing scope.

**Examples**

You can query the `key` object for the state of any key at any point (even in code other than the key shortcut handlers)

**Querying Modifier Keys**

For example, `key.shift` is `true` if the shift key is currently pressed. This allows easy implementation of things like shift+click handlers.

```js
if(event.key.shift) alert('shift is pressed, OMGZ!');
```

**Other key Queries**

`key.isPressed(77)` is `true` if the M key is currently pressed.

```js
if(event.key.isPressed("M")) alert('M key is pressed, can ya believe it!?');
if(event.key.isPressed(77)) alert('M key is pressed, can ya believe it!?');
```

You can also get these as an array using...
```js
event.key.getPressedKeyCodes() // returns an array of key codes currently pressed
```

### Key Scopes

If you want to reuse the same shortcut for separate areas in your single page app,
Keymaster supports switching between scopes. Use the `key.setScope` method to set scope.

```js
// define shortcuts with a scope
event.key('o, enter', 'issues', function(){ /* do something */ });
event.key('o, enter', 'files', function(){ /* do something else */ });

// set the scope (only 'all' and 'issues' shortcuts will be honored)
event.key.setScope('issues'); // default scope is 'all'
```
