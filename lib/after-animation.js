var Event     = require( 'bean' ),
    delay     = require( './delay' ),
    supported = require( './animation-events' ).supported

function animationDuration( el ) {
  return window.getComputedStyle( el ).getPropertyValue( 'animation-duration' )
}

// Watches all document animation add add data attributes to elements when they begin
// This enables animationEnd to watch animations which haven't begun
function watchAnimation() {
  Event.on( document, 'animationstart', function( event ) {
    event.target.dataset.isAnimating = true
  })
  Event.on( document, 'animationend', function( event ) {
    event.target.removeAttribute('data-is-animating')
  })
}

// This requires trackElementAnimation to be enabled
function afterAnimation( el, callback, startTimeout ) {
  // Animation is not supported, just trigger the callback
  if ( !supported ) return callback()

  // Animation has already begun
  if ( el.dataset.isAnimating || el.querySelector( '[data-is-animating]' ) ) {

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
        callback()
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
  }
}

afterAnimation.watch = watchAnimation

module.exports = afterAnimation
