var Event = require( 'bean' )
var throttle = require( './throttle' )
var debounce = require( './debounce' )
var callbacks = { all: [], start: [], stop: []}

// Event manager for firing callbacks on optimizedScroll
var scroll = function( fn ) {
  callbacks.all.push( fn ) 
}

var scrollStart = function( fn ) {
  callbacks.start.push( fn )
}

var scrollStop = function( fn ) {
  callbacks.stop.push( fn )
}

// Triggered by leading debounced function (when scrolling starts)
var startScroll = function() {
  Event.fire( window, 'scrollStart' ) 
  callbacks.start.forEach( function( fn ) { fn() } )
}

// Triggered by leading debounced function (when scrolling stops)
var stopScroll = function() {
  Event.fire( window, 'scrollStop' ) 
  callbacks.stop.forEach( function( fn ) { fn() } )
}

// A debounced function to trigger scrolling start and stop events
var scrollEvents = debounce({
  leading: startScroll,
  trailing: stopScroll,
  wait: 150
})

// Fire custom event for easy optimized event listening
var scrolled = throttle( function() {
  
  // Trigger a custom event to allow easy listening for paint ready scroll events.
  Event.fire( window, 'optimizedScroll' )

  // Trigger each function queued for optimized scrolling
  callbacks.all.forEach( function( fn ) { fn() } )
})

// Watch the scroll firehose and trigger
// debounced and trhottled events
Event.on( window, 'scroll', function() {
  scrolled()
  scrollEvents()
})

// Export the event manager
module.exports = scroll
