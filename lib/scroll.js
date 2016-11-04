var Event           = require( 'bean' )
var callbackManager = require( './callback-manager' )
var throttle        = require( './throttle' )
var debounce        = require( './debounce' )

// Create a new scrolling callback manager
var manager = callbackManager.new()

// Add custom events for to trigger optimized scroll listeners.
manager.add( function() { Event.fire( window, 'optimizedScroll' ), 'scroll' })
manager.add( function() { Event.fire( window, 'startScroll' ) }, 'start')
manager.add( function() { Event.fire( window, 'stopScroll' ) }, 'stop')

var scroll = function( fn ) {
  return manager.add( fn, 'scroll' )
}

var scrollStart = function( fn ) {
  return manager.add( fn, 'start' )
}

var scrollStop = function( fn ) {
  return manager.add( fn, 'stop' )
}

// Trigger callbacks when scrolling starts/stops (at paint-ready frames)
var scrollEvents = debounce({
  leading: function() { manager.fire( 'start' ) },
  trailing: function() { manager.fire( 'stop' ) },
  wait: 150
})

// Trigger callbacks when scrolling happens (at paint-ready frames)
var scrolled = throttle( function() {
  manager.fire( 'scroll' )
})

Event.on( window, 'scroll', function() {
  scrolled()
  scrollEvents()
})

// Pause pointer events during scrolling for better performance
// This prevents unnecessary interactions and repaints
scroll.disablePointer = function() {
  scrollStart( function() {
    document.documentElement.style.pointerEvents = 'none'
  })
  scrollStop( function() {
    document.documentElement.style.pointerEvents = ''
  })
}

module.exports = {
  scroll: scroll,
  start: scrollStart,
  stop: scrollStop
}
