# Spark Engine Event

This is a unified events framework handling standard events, keyboard events,
and tap events (for touch screen devices). It features:

- Easy DOM event management, powered by [bean](https://github.com/fat/bean).
- Custom `tap` event for properly discerning touch events.
- Simple keyboard events, powered by [keymaster](https://github.com/madrobby/keymaster).
- Event managers for attaching listeners to dom `ready`, page `change`, window `resize` and `scroll`.
- Callback manager for enabling, disabling and toggling the ability for callbacks to trigger.
- Custom event mangaers for registering many callbacks with `start`, `stop`, and `toggle` capability.
- Throttle and Debounce functions tied to request animation frame for better paint performance.

If you want to trigger events on DOM ready, when a page changes, or during a scroll or resize event, use these
event managers to register your functions.

- <a href="#ready">event.<code>ready()</code></a>
- <a href="#change">event.<code>change()</code></a>
- <a href="#scroll">event.<code>scroll()</code></a>
- <a href="#resize">event.<code>resize()</code></a>

**DOM Listeners** - Use these functions to attach DOM event listeners.

- <a href="#on">event.<code>on()</code></a>
- <a href="#one">event.<code>one()</code></a>
- <a href="#off">event.<code>off()</code></a>
- <a href="#clone">event.<code>clone()</code></a>
- <a href="#fire">event.<code>fire()</code></a>
- <a href="#afteranimation">event.<code>afterAnimation()</code></a>

**Keyboard Listeners** - Use these functions to attach keyboard event listeners.

- <a href="#keyon">event.<code>keyOn()</code></a>
- <a href="#keyoff">event.<code>keyOff()</code></a>
- <a href="#keyOne">event.<code>keyOne()</code></a>
- <a href="#key">event.<code>key</code></a>

**Media Query Listeners** - trigger callbacks when media queries become true/untrue.

- <a href="#width">event.<code>media.width()</code></a>
- <a href="#minwidth">event.<code>media.minWidth()</code></a>
- <a href="#maxwidth">event.<code>media.maxWidth()</code></a>
- <a href="#height">event.<code>media.height()</code></a>
- <a href="#minheight">event.<code>media.minHeight()</code></a>
- <a href="#maxheight">event.<code>media.maxHeight()</code></a>

**Timing functions** - Control when functions are executed and how frequently.

- <a href="#delay">event.<code>delay()</code></a>
- <a href="#repeat">event.<code>repeat()</code></a>
- <a href="#throttle">event.<code>throttle()</code></a>
- <a href="#debounce">event.<code>debounce()</code></a>

**Helpers** - These are tiny event utilities which make things a bit nicer.

- <a href="#bubbleFormEvents">event.<code>bubbleFormEvents()</code></a>
- <a href="#scroll.disablePointer">event.<code>scroll.disablePointer()</code></a>
- <a href="#resize.disableAnimation">event.<code>resize.disableAnimation()</code></a>
- <a href="#submit">event.<code>submit()</code></a>


## Event managers

These event managers make it easier to handle event listeners for DOM ready, page transitions, and window scroll. This triggeres event callbacks
efficiently and adds some other niceities.

<a name="ready"></a>
### ready( callback )
<code>event.ready()</code> lets you add callbacks to be fired whenever the browser's `DOMContentLoaded` event is fired. For a site which
uses ajax to fetch subsequent pages, it's important to note that this is only fired once with each full page load.

```js
event.ready( function(){ /* do something */ } )
```

This adds callbacks to an array and fires them each from a single event listener. If an event callback is added after the page has already loaded, it will fire immediately.
This will also fire events registered with the change function below, unless you are using Turbolinks which triggers `page:change` on its own.

<a name="change"></a>
### change( callback )
<code>event.change()</code> lets you add callbacks to be fired whenever a `page:chage` event is fired. This is the sort
of even that is used in pjax or Turbolinks to signal that the DOM has loaded new content, likely via ajax which means you
may need to remove listeners, bootstrap widgets, or whatever you do when content changes.

```js
event.change( function(){ /* do something */ } )
```

Just like `ready`, this adds your callback to an array, fired from a single listener. If a function is added after `page:change` has been fired, it will fire immediately.

<a name="scroll"></a>
### scroll( callback )
<code>event.scroll()</code> lets you add callbacks to be fired whenever the `window`'s `scroll` event is fired (throttled by `requestAnimationFrame`). 

```js
event.scroll( function(){ /* scrolling is happening */ } )
event.scroll.start( function(){ /* scrolling has started */ } )
event.scroll.end( function(){ /* scrolling has ended */ } )
```

This fires all callbacks at with `requestAnimationFrame()` ensuring that events are fired during the 
browser's natural repaint cycle (every 16ms at 60fps). This helps prevent scattered repaints and jittery graphics performance.

#### Pause & Resume Callbacks

You may want to deactivate a callback and later reactivate it. To do so, save a reference to
the callback when registering it. Then call `stop()` or `start()` on the callback reference.

```js
var scrollWatch = event.scroll( function(){ /* scrolling is happening */ } )
scrollWatch.stop()   // prevent callback from executing
scrollWatch.start()  // allow callback to execute again
```

<a name="resize"></a>
### resize( function  )
<code>event.resize()</code> lets you add callbacks to be fired whenever the `window`'s `resize` event is fired (throttled by `requestAnimationFrame`). 

```js
event.resize( function(){ /* window is being resized */ } )
event.resize.start( function(){ /* resizing just started */ } )
event.resize.end( function(){ /* resizing just ended */ } )
```

This fires all callbacks at with `requestAnimationFrame()` ensuring that events are fired during the 
browser's natural repaint cycle (every 16ms at 60fps). This helps prevent scattered repaints and jittery graphics performance.

#### Pause & Resume Callbacks

Just like with the scroll event manager, you may want to deactivate a callback and later reactivate it. To do so, save a reference to the callback when registering it. Then call `stop()` or `start()` on the callback reference.

```js
var resizeWatch = event.scroll( function(){ /* resizing is happening */ } )
resizeWatch.stop()   // prevent callback from executing
resizeWatch.start()  // allow callback to execute again
```

### Custom Event Managers

You can use a custom event manager to fire `start`, `end` and `requestAnimationFrame` throttled events for any type of event. This can be simpler than managing throttling and debouncing manually.

```js
event.eventManager.new('event', [{ target: Selector or Element (default: window), delay: 150, throttle: true }])
```

For example, if you want to trigger callbacks when scrolling a panel

```js
var panelScroll = event.eventManager.new('scroll', { target: '#some-panel' })

panelScroll.start(function(event){ /* panel scrolling has started */ })
panelScroll(function(event){       /* panel scrolling is happening */ })       
panelScroll.end(function(event){   /* panel scrolling has ended */ })   
```

## Event Listeners

Much of the documentation below has been copied from dependent libraries and modified where necessary. To dig deeper be sure to reference
the documentation for [bean](https://github.com/fat/bean) and [keymaster](https://github.com/madrobby/keymaster).

<a name="on"></a>
### on( element, eventType[, selector], handler[, args ] )
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
Var event = require( '@spark-engine/event' )

// simple
event.on( element, 'click', handler );

// optional arguments passed to handler
event.on( element, 'click', function( event, option1, option2 ) {
  console.log( option1, option2 );
}, optional, args );

// multiple events
event.on( element, 'keydown keyup', handler );

// multiple handlers
event.on( element, {
  click:        function ( e ) {},
  mouseover:    function ( e ) {},
  'focus blur': function ( e ) {}
});
```

**Delegation**

```js
// event delegated events
event.on( element, 'click', '.content p', handler );

// Alternatively, you can pass an array of elements.
// This cuts down on selector engine work, and is a more performant means of
// delegation if you know your DOM won't be changing:
event.on( element, [el, el2, el3], 'click', handler );
event.on( element, document.querySelectorAll('.myClass'), 'click', handler );
```

**Differences to Bean events**

Even though with Bean (the core of the events system) using an object to register multiple events at once means
you cannot have delegation or optional arguments, @spark-engine/event processes
arguments to allow these features without issue. Here's what that looks like.

```js
// Multiple events + delegation + optional arguments
event.on( element, {
  click:        function ( e ) {},
  mouseover:    function ( e ) {},
  'focus blur': function ( e ) {}
}, '.content p', 'optional', 'argument');
```

Another difference is that you can create a new 'tap' event which looks like this.

```js
event.on( element, 'tap', function() {} )
```

This attaches a `touchstart` event and watches for movement or additional fingers, which would indicate a canceled or uninteneded tap. If a
user does not move their finger or add an additional finger, their intent is determined as a tap, and the callback function is executed.

**Note:** Remember to stop propagation on a tap event if you do not want it to also fire a click event, since mobile devices typically fire
a click event a part of the touch event lifecycle.

<a name="one"></a>
### one( element, eventType[, selector], handler[, args ] )
<code>event.one()</code> is an alias for <code>event.on()</code> except that the handler will only be executed once and then the listener
will be removed. If you use `one` for multiple events, the listener will be removed as each event is fired.

<a name="off"></a>
### off( element[, eventType[, handler ]] )
<code>event.off()</code> is how you get rid of handlers once you no longer want them active. It's also a good idea to call *off* on elements before removing them from your DOM; this helps prevent memory leaks.

**Arguments**

- **element / object** (DOM Element or Object) - an HTML DOM element or any JavaScript Object
- **event type(s)** (optional String) - an event (or multiple events, space separated) to remove
- **handler** (optional Function) - the specific callback function to remove

Optionally, event types and handlers can be passed in an object of the form `{ 'eventType': handler }` as the second argument, just like `on()`.

**Examples**

```js
// remove a single event handlers
event.off( element, 'click', handler );

// remove all click handlers
event.off( element, 'click' );

// remove handler for all events
event.off( element, handler );

// remove multiple events
event.off( element, 'mousedown mouseup' );

// remove all events
event.off( element );

// remove handlers for events using object literal
event.off( element, { click: clickHandler, keyup: keyupHandler } )
```

<a name="clone"></a>
### clone( destElement, srcElement[, eventType ] )
<code>event.clone()</code> is a method for cloning events from one DOM element or object to another.

**Examples**

```js
// clone all events at once by doing this:
event.clone( toElement, fromElement );

// clone events of a specific type
event.clone( toElement, fromElement, 'click' );
```

--------------------------------------------------------
<a name="fire"></a>
### fire( element, eventType[, args ] )
<code>event.fire()</code> gives you the ability to trigger events.

**Examples**

```js
// fire a single event on an element
event.fire( element, 'click' );

// fire multiple types
event.fire( element, 'mousedown mouseup' );
```

### The `Event` object

Bean implements a variant of the standard DOM `Event` object, supplied as the argument to your DOM event handler functions. Bean wraps and *fixes* the native `Event` object where required, providing a consistent interface across browsers.

```js
// prevent default behavior and propagation (even works on old IE)
event.on( el, 'click', function ( event ) {
  event.preventDefault();
  event.stopPropagation();
});

// a simple shortcut version of the above code
event.on( el, 'click', function ( event ) {
  event.stop();
});

// prevent all subsequent handlers from being triggered for this particular event
event.on( el, 'click', function ( event ) {
  event.stopImmediatePropagation();
});
```

**Note:** Your mileage with the `Event` methods (`preventDefault` etc.) may vary with delegated events as the events are not intercepted at the element in question.

### object support

Everything you can do with an element, you can also do with an object. this is particularly useful for working with classes or plugins.

```js
var inst = new klass();
event.on( inst, 'complete', handler );

//later on...
event.fire( inst, 'complete' );
```

<a name="fire"></a>
### afterAnimation( element, callback, [startTimeout] )
<code>event.afterAnimation()</code>, a better animation event queue.

This will trigger a callback:

- After animation completes, or
- After a timeout if animation is delayed or never starts, or
- Immediately if animation is not supported by the browser.

This works like `event.one( el, 'animationend', callback)` but is safe to use on elements which may not have animations, or in browsers which may not support them.

For example:

```js
var el = document.querySelector( '#loose-canon' )
el.classList.add( '.play-it-straight-or-turn-in-your-badge' )

event.afterAnimation( el, function() {
  // save the day
}, 50)
```

In the example above the optional `startTimeout` was set. This will trigger the callback if animation has not begun after `50` miliseconds.
`startTimeout` can also be set to `true` which will wait for `32ms` about two animation frames before aborting and triggering the callback.

## Keybaord events

<a name="keyon"></a>
### keyOn( 'key', handler )
<code>event.keyOn()</code> gives you the ability to trigger events from keypresses.

**Examples**

```js
// simple
event.keyOn( 'a', function(){ alert( 'you pressed a!' ) } );

// You can also chain modifier keys and stop events like this.
event.keyOn( 'ctrl+r', function() { alert( 'stopped reload!' ); return false } );

// multiple shortcuts that do the same thing
event.keyOn( '⌘+r, ctrl+r', function() { } );
```

The handler method is called with two arguments set, the keydown `event` fired, and
an object containing, among others, the following two properties:

`shortcut`: a string that contains the shortcut used, e.g. `ctrl+r`
`scope`: a string describing the scope (or `all`)

```js
event.keyOn( '⌘+r, ctrl+r', function( event, handler ){
  console.log( handler.shortcut, handler.scope );
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
### keyOne( 'key', handler )
<code>event.keyOne()</code> is an alias for `key()` but it fires once and removes its listener.

This will execute the callback and stop listening for the escape key.

```js
// simple
event.keyOne( 'esc', function() { alert( 'Escaping!' ) } );
```

<a name="keyoff"></a>
### keyOff( 'key', handler )
<code>event.keyOff()</code> removes event listeners for keys.

```javascript
// unbind 'a' handler
key.unbind( 'a' );

// unbind a key only for a single scope
// when no scope is specified it defaults to the current scope (key.getScope())
key.unbind( 'o, enter', 'issues' );
key.unbind( 'o, enter', 'files' );
```


<a name="key"></a>
### key
<code>event.key</code> gives you access to the key object for querying key states and managing scope.

**Examples**

You can query the `key` object for the state of any key at any point (even in code other than the key shortcut handlers)

**Querying Modifier Keys**

For example, `key.shift` is `true` if the shift key is currently pressed. This allows easy implementation of things like shift+click handlers.

```js
if( event.key.shift ) alert( 'shift is pressed, OMGZ!' );
```

**Other key Queries**

`key.isPressed( 77 )` is `true` if the M key is currently pressed.

```js
if( event.key.isPressed("M") ) alert( 'M key is pressed, can ya believe it!?' );
if( event.key.isPressed(77) )  alert( 'M key is pressed, can ya believe it!?' );
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
event.key( 'o, enter', 'issues', function() { /* do something */ } );
event.key( 'o, enter', 'files', function() { /* do something else */ } );

// set the scope (only 'all' and 'issues' shortcuts will be honored)
event.key.setScope( 'issues' ); // default scope is 'all'
```

## Media Query Listeners

<a name="width"></a>
### media.width( sizes, [callback] )
<code>event.media.width()</code> Check a `width` media query and register a callback to be triggered when that media query becomes true/untrue.

```js
function handleQuery( query ) {
  if ( query.matches ) { /* query is true */ }
  else                 { /* query is true */ }
}

// Triggler handler when viewport width is between 400px and 800px
queryList = event.media.width( { min: 400, max: 800 }, handleQuery )
```

<a name="minwidth"></a>
### media.minWidth( size, [callback] )
<code>event.media.minWidth()</code> Check a `min-width` media query and register a callback to be triggered when that media query becomes true/untrue.

```js
// Triggler handler when viewport width is greater than 400px
queryList = event.media.minWidth( 400, handleQuery )
```

<a name="maxwidth"></a>
### media.maxWidth( size, [callback] )
<code>event.media.maxWidth()</code> Check a `min-width` media query and register a callback to be triggered when that media query becomes true/untrue.

```js
// Triggler handler when viewport width is less than 800px
queryList = event.media.maxWidth( 800, handleQuery )
```

<a name="height"></a>
### media.height( sizes, [callback] )
<code>event.media.height()</code> Check a `height` media query and register a callback to be triggered when that media query becomes true/untrue.

```js
// Triggler handler when viewport height is between than 400px and 800px
queryList = event.media.height( { min: 400, max: 800 }, handleQuery )
```


<a name="minheight"></a>
### media.minHeight( size, [callback] )
<code>event.media.minHeight()</code> Check a `min-height` media query and register a callback to be triggered when that media query becomes true/untrue.

```js
// Triggler handler when viewport height is greater than 400px
queryList = event.media.minHeight( 400, handleQuery )
```

<a name="maxheight"></a>
### media.maxHeight( size, [callback] )
<code>event.media.maxHeight()</code> Check a `max-height` media query and register a callback to be triggered when that media query becomes true/untrue.

```js
// Triggler handler when viewport height is less than 800px
queryList = event.media.maxHeight( 800, handleQuery )
```

## Timing functions

<a name="delay"></a>
### delay( function, [wait, arguments] )
<code>event.dealy()</code> lets you call functions after a period of time. Execution is queued with `requestAnimationFrame()` which ensures that callbacks
are triggered optimally to prevent unnecessary repainting. If your callback doesn't change the DOM and you need to execute a function more precicely, use
`setTimeout()` instead.


Here we'll call `scat()` during the browser's repaint cycle immediately following 500ms.

```js
function scat() { console.log( 'skippity bop!' ) }
event.delay( scat, 500 )
```

We can also pass arugments to the delayed function, and even stop it from being executed.

```js
var handle = event.delay( scat, 2500, some, args )

// stop the delayed call
handle.stop()
```

<a name="repeat"></a>
### repeat( function, [wait, limit, arguments] )
<code>event.repeat()</code> lets you call functions on a regular interval with `requestAnimationFrame()`, ensuring that callbacks
are triggered optimally to prevent unnecessary repainting. If your callback doesn't change the DOM and you need to execute a function more precicely, use
`setInterval()` instead. This adds a helpful `limit` option which stops repeating after a set number of times.

Here we'll call `scat()` during the repaint cycle closest to 200ms.

```js
function scat() { console.log( 'skippity bop!' ) }
event.repeat( scat, 200 )
```

This will call `scat()` 10 times, during the repaint cycle closest to 200ms.

```js
var handle = event.repeat( scat, 200, 10 )

// Or you can manually stop the repeating
handle.stop()
```


You can even execute a function after repeating stops.

```js
var handle = event.repeat( scat, 200, 10 )

// Assign a function to trigger when the repeating stops.
handle.complete = function() { console.log ( 'take a bow' ) }
```

This will trigger a callback with each repaint cycle.

```js
// These are all equivilent
event.repeat( scat )
event.repeat( scat, 0 )
event.repeat( scat, 0, 0 )
```

You can also pass arguments to the callback function like this.

```js
event.repeat( scat, 200, 10, some, args )
```

<a name="throttle"></a>
### throttle( function, [wait, options] )
<code>event.throttle()</code> prevents functions from being called except on the repaint cycle after every `wait` miliseconds. This uses `requestAnimationFrame()` to prevent callbacks from triggering unnecessary repaints. If your callbacks will not affect the DOM and you need more assurance of their execution time, you'll want to use a different throttle function.

```js
var resizer = function() {
  // modify the DOM
}
// Create a throttled version of the resize
var throttledResize = throttle( resize, 200 )

// Only executes on the repait cycle after every 200ms 
event.on( window, 'resize', throttledResize )
```

To allow a callback to execute with every repaint cycle don't provide a wait time.

```js
var throttledResize = throttle( resize )
```

To stop a throttled callback from being executed:

```js
// Remove it from the animation queue and prevent it from executing
throttledResize.stop()
```

Throttled functions pass arguments through to the original callback.

```js
var test = function ( event ) {
  console.log( event.target )
}

event.on( window, 'scroll', throttle( test, 200 ) )
```

<a name="debounce"></a>
### debounce( function, [wait, options] )
<code>event.debounce()</code> prevents functions from being called except on the repaint cycle after every `wait` miliseconds since the last time the function was executed. This is similar to throttle, exept rather than executing on a regular interval, callbacks are only triggered `wait` miliseconds after the last time they were called.

For example if you want to validate a form input after someone finishes typing, you'd do this.

```js
var validate = function( event ) { // some awesome code }

event.on( someInput, 'keyup', debounce( validate, 200 ) )
```

This will wait 200ms after the last `keyup` event to trigger the script js. You'll notice that the
validate function accepts the event argument, this is because arguments are passed through to the
callback.

Debounce also accepts an object as the first parameter.

```js
debounce({
  callback: [function],      // Default callback for leading and trailing
  trailing: [bool/function], // bool: Execute trailing callback. function: callback for leading trigger
  leading:  [bool/function], // bool: Execute leading callback. function: callback for leading trigger
  wait:     150,             // Miliseconds to debounce callbacks
  max:      1000,            // Maximum time to debounce callbacks before forcing a trigger
})
```

These are equivilent ways to create a *trailing-only* debounced function.

```js
// Equivilent ways to create a trailing-only debounce.

debounce( someFunc, 100 )
debounce( { callback: someFunc, wait: 100 } )
debounce( { trailing: someFunc }, 100 )
```

These are equivilent ways to create a *leading-only* debounced function.

```js
debounce( someFunc, 100, { leading: true, trailing: false } )
debounce( { leading: someFunc, trailing: false, wait: 100 } )
debounce( { leading: someFunc, trailing: false }, 100 )
```

#### Understanding Leading & Trailing debounce callbacks

As noted above, debounce fires callbacks `wait` miliseconds from the last call. This is called a `trailing` callback. This is the default, but you can also
fire `leading` callbacks which fire immediately after the first call but not again until it has been `wait` miliseconds from the last callback call.

Here's an example where debounce is leading and trailing and set to 150 miliseconds.

```js
// Track leading and trailing by enabling leading in the options

var leadingAndTrailing = debounce( someFunc, 150, { leading: true })
event.on( window, 'scroll', leadingAndTrailing )
```

Here is what it looks like when the debounced function is triggered. The `*` represents times a scroll has occured.

```
                             (150 ms after)           (150 ms after)
----------------|------------------•------------|-------------•-------------
scroll:         *** * *  *                      *** *        

leading:        A                               A          
trailing:                          Ω                          Ω 
```

To fire leading callbacks only, disable trailing in the options.

```js
var leadingOnly = debounce( someFunc, 150, { leading: true, trailing: false })
```

For a simple example, lets consider what happens if a `click` event is fired twice (a double click).

- When `leading` the callback fires immediately.
- When `trailing` the callback fires `wait` ms after the last click.
- When both, the callback fires immediately and then `wait` ms after the last click.

#### Different leading and trailing callbacks

You can trigger different leading and trailing callbacks to mark the start and end of a barrage of debounced calls. For example, you might track the
beginning and ending of a user scrolling.

Note: To aid in clarity, you can pass an options block first (instead of a function) to the debounce function as demonstrated below.

```js
var watchScroll = debounce({
  leading:  function() { // scrolling has begun },
  trailing: function() { // scrolling has ended }
}, 150)

event.on( window, 'scroll', watchScroll )
```

#### Setting a maximum wait time

Set the optional `max` value to prevent a function from going more than `max` miliseconds without being executed.

```js
var debouncedFunc = debounce( someFunc, 200, { max: 1000 } )
```

In the example above if the debounced function is called every `100ms`, `someFunc` will never be
executed since the wait is set to `200ms`. By setting `max` to `1000ms`, we ensure that `someFunc` will be called at least once a
second.


<a name="bubbleFormEvents"></a>
### bubbleFormEvents()

By default, input `focus`, `blur`, and form `submit` events do not bubble up the DOM. You can add bubbling support for these events like this.

```js
event.bubbleFormEvents()
```

Here's what this does.

1. On page change, event listeners for `focus`, `blur` and `submit` are added to input and form elements.
2. When events are fired, a custom event (which will bubble up the DOM) is fired on the target's parent element, passing along the original event object.
3. Ajax page changes remove and re-add event listeners automatically.

This means you can attach a single listener to the `document` or a `form` and respond to these events wihtout having to manage a host of listeners.

<a name="scroll.disablePointer"></a>
### scroll.disablePointer()

While scrolling down a page, your pointer may interact with elements which pass under it. This may cause
unnecessary repaints, causing a jittery scrolling experience. This little utility simply watches scroll
events and disables pointer events while scrolling.

```js
event.scroll.disablePointer()
```

This registers itself with `scroll.start` and `scroll.stop` event managers to optimize event listener usage and
offer the best performance possible.

<a name="resize.disableAnimation"></a>
### resize.disableAnimation()

This prevents transitions and animations from being triggered when resizing the window, preventing
unnecessary repaints, causing a jittery resize experience. This little utility simply watches resize
events and disables pointer events while resizing.

```js
event.resize.disableAnimation()
```

This registers itself with `resize.start` and `resize.stop` event managers to optimize event listener usage and

<a name="submit"></a>
### submit()

Triggers a DOM bubbling, cancelable form submsision event.

```js
event.submit( formElement )
```

Event listeners watching `submit` on that form element will be able to do their work, or even `preventDefault()`.

**Why?** Because `form.submit()` doesn't fire events which can trigger listeners or be canceled.
**How?** This triggers a `CustomEvent` and if the event is not `defaultPrevented` it will then fire `form.submit()`.
