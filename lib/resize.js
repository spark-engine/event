var Event           = require( 'bean' )
var callbackManager = require( './callback-manager' )
var throttle        = require( './throttle' )
var debounce        = require( './debounce' )

// Create a new resizing callback manager
var resizeEvent = {
  resize: callbackManager.new(),
  start: callbackManager.new(),
  stop: callbackManager.new()
}

// Add custom events for to trigger optimized resize listeners.
resizeEvent.resize.add( function() { Event.fire( window, 'optimizedResize' ) } )
resizeEvent.start.add(  function() { Event.fire( window, 'startResize' ) } )
resizeEvent.stop.add(   function() { Event.fire( window, 'stopResize' ) } )

var resize = function( fn ) {
  return resizeEvent.resize.add( fn )
}

var resizeStart = function( fn ) {
  return resizeEvent.start.add( fn )
}

var resizeStop = function( fn ) {
  return resizeEvent.stop.add( fn )
}

// Trigger callbacks when resizing starts/stops (at paint-ready frames)
var debounceResize = debounce({
  leading: resizeEvent.start.fire,
  trailing: resizeEvent.stop.fire,
  wait: 150
})

// Trigger callbacks when resizing happens (at paint-ready frames)
var throttleResize = throttle( resizeEvent.resize.fire )

Event.on( window, 'resize', function() {
  throttleResize()
  debounceResize()
})

// Pause animations during resizing for better performance
resize.disableAnimation = function() {
  var style = '<style id="fullstop">.no-animation *, .no-animation *:after, .no-animation *:before {\
    transition: none !important; animation: none !important\
  }</style>'

  var animationOff = function() {
    if ( !document.querySelector('style#fullstop') ) { 
      document.head.insertAdjacentHTML('beforeend', style)
    }
    document.body.classList.add( 'no-animation' )
  }

  var animationOn = function() {
    document.body.classList.remove( 'no-animation' )
  }

  resizeStart( animationOff )
  resizeStop( animationOn )
}

module.exports = {
  resize: resize,
  start: resizeStart,
  stop: resizeStop
}
