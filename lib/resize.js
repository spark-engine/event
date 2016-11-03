var Event = require( 'bean' )
var throttle = require( './throttle' )
var debounce = require( './debounce' )
var callbacks = { all: [], start: [], stop: []}

// Event manager for firing callbacks on optimizedresize
var resize = function( fn ) {
  callbacks.all.push( fn ) 
}

var resizeStart = function( fn ) {
  callbacks.start.push( fn )
}

var resizeStop = function( fn ) {
  callbacks.stop.push( fn )
}

// Triggered by leading debounced function (when resizing starts)
var startResize = function() {
  Event.fire( window, 'resizeStart' ) 
  callbacks.start.forEach( function( fn ) { fn() } )
}

// Triggered by leading debounced function (when resizing stops)
var stopResize = function() {
  Event.fire( window, 'resizeStop' ) 
  callbacks.stop.forEach( function( fn ) { fn() } )
}

// A debounced function to trigger resizing start and stop events
var resizeEvents = debounce({
  leading: startResize,
  trailing: stopResize,
  wait: 150
})

// Fire custom event for easy optimized event listening
var resized = throttle( function() {
  
  // Trigger a custom event to allow easy listening for paint ready resize events.
  Event.fire( window, 'optimizedResize' )

  // Trigger each function queued for optimized resizeing
  callbacks.all.forEach( function( fn ) { fn() } )
})

// Watch the resize firehose and trigger
// debounced and trhottled events
Event.on( window, 'resize', function() {
  resized()
  resizeEvents()
})

// Export the event manager
module.exports = resize
