var manager = require( './optimized-event-manager' )
var resize  = manager.new( 'resize' )

// Pause animations during resizing for better performance
resize.disableAnimation = function() {
  var style = '<style id="fullstop">.no-animation *, .no-animation *:after, .no-animation *:before {\
    transition: none !important; animation: none !important\
  }</style>'

  // Inject style for easy classname manipulation
  if ( !document.querySelector('style#fullstop') ) { 
    document.head.insertAdjacentHTML('beforeend', style)
  }

  resize.start( function() { document.body.classList.add( 'no-animation' ) } )
  resize.stop( function() {  document.body.classList.remove( 'no-animation' ) } )
}

module.exports = resize
