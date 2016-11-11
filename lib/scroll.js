var manager = require( './optimized-event-manager' )
var scroll  = manager.new( 'scroll' )

scroll.disablePointer = function() {

  // Disable pointer interaction
  scroll.start( function() {
    document.documentElement.style.pointerEvents = 'none'
  })

  // Enable pointer interaction
  scroll.stop( function() {
    document.documentElement.style.pointerEvents = ''
  })
}

module.exports = scroll
