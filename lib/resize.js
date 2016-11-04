var Event           = require( 'bean' )
var callbackManager = require( './callback-manager' )
var throttle        = require( './throttle' )
var debounce        = require( './debounce' )

// Create a new resizing callback manager
var manager = callbackManager.new()

// Add custom events for to trigger optimized resize listeners.
manager.add( function() { Event.fire( window, 'optimizedResize' ), 'resize' })
manager.add( function() { Event.fire( window, 'startResize' ) }, 'start')
manager.add( function() { Event.fire( window, 'stopResize' ) }, 'stop')

var resize = function( fn ) {
  return manager.add( fn, 'resize' )
}

var resizeStart = function( fn ) {
  return manager.add( fn, 'start' )
}

var resizeStop = function( fn ) {
  return manager.add( fn, 'stop' )
}

// Trigger callbacks when resizing starts/stops (at paint-ready frames)
var resizeEvents = debounce({
  leading: function() { manager.fire( 'start' ) },
  trailing: function() { manager.fire( 'stop' ) },
  wait: 150
})

// Trigger callbacks when resizing happens (at paint-ready frames)
var resized = throttle( function() {
  manager.fire( 'resize' )
})

Event.on( window, 'resize', function() {
  resized()
  resizeEvents()
})

module.exports = {
  resize: resize,
  resizeStart: resizeStart,
  resizeStop: resizeStop
}
