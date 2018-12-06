var Event  = require( 'bean' )
var delay  = require( './delay' )
var page   = require( './page' )

function animationDuration( el ) {
  return window.getComputedStyle( el ).getPropertyValue( 'animation-duration' )
}

// This requires trackElementAnimation to be enabled
function afterAnimation( el, callback, startTimeout ) {
  var supportsAnimation = !!animationDuration( el )

  // Animation is not supported, just trigger the callback
  if ( !supportsAnimation ) return callback()

  // Animation has already begun
  if ( animationDuration( el ) != '' ) {

    // Watch for end
    Event.one( el, 'animationend', callback )

  // Animation has not yet begun so…
  } else {

    // startTimeout is meant to ensure that a callback is fired even if 
    // an animation event, or in the case that an animation event is never triggered
    // this might happen if a user wants to fire a callack after an element animates
    // or fire the callback anyway if the element doesn't have an animation.
    if ( startTimeout ) {

      // Set a default timeout (allowing startTimeout == true or a specified number of milisecons)
      var time = ((typeof startTimeout == "number") ? startTimeout : 32) // 32ms: ~ two frames of animation grace period

      var delayedEvent = delay( function() {
        // Stop watching for animation to start
        // Why? - If the animation starts later, the callback will fire twice
        Event.off( el, 'animationstart', watchEndEvent ) 
      }, time )
    }

    // Next:
    // Register a function to attach callback to animationEnd event
    function watchEndEvent () {
      if ( startTimeout ) delayedEvent.stop()    // cancel delayed fire
      Event.one( el, 'animationend', callback ) // watch for animation to finish
    }
    
    // Finally, when the animation does start, watch for its end
    Event.one( el, 'animationstart', watchEndEvent )

  } else {
    Event.one( el, 'animationend', callback )
  }
}

modle.exports = afterAnimation
