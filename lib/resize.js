var Event           = require( 'bean' )
var callbackManager = require( './callback-manager' )
var throttle        = require( './throttle' )
var debounce        = require( './debounce' )

// Create a new scrolling callback manager
var scrollEvent = {
  scroll: callbackManager.new(),
  start: callbackManager.new(),
  stop: callbackManager.new()
}

// Add custom events for to trigger optimized scroll listeners.
scrollEvent.scroll.add( function() { Event.fire( window, 'optimizedScroll' ) } )
scrollEvent.start.add(  function() { Event.fire( window, 'startScroll' ) } )
scrollEvent.stop.add(   function() { Event.fire( window, 'stopScroll' ) } )

var scroll = function( fn ) {
  return scrollEvent.scroll.add( fn )
}

var scrollStart = function( fn ) {
  return scrollEvent.start.add( fn )
}

var scrollStop = function( fn ) {
  return scrollEvent.stop.add( fn )
}

// Trigger callbacks when scrolling starts/stops (at paint-ready frames)
var debounceScroll = debounce({
  leading: scrollEvent.start.fire,
  trailing: scrollEvent.stop.fire,
  wait: 150
})

// Trigger callbacks when scrolling happens (at paint-ready frames)
var throttleScroll = throttle( scrollEvent.scroll.fire )

Event.on( window, 'scroll', function() {
  throttleScroll()
  debounceScroll()
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
