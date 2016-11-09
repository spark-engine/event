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

// Pause pointer events during resizing for better performance
// This prevents unnecessary interactions and repaints
resize.disablePointer = function() {
  resizeStart( function() {
    document.documentElement.style.pointerEvents = 'none'
  })
  resizeStop( function() {
    document.documentElement.style.pointerEvents = ''
  })
}

module.exports = {
  resize: resize,
  start: resizeStart,
  stop: resizeStop
}
