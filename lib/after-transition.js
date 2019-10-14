var Event     = require('@spark-engine/bean'),
    delay     = require('./delay')

// Watches all document transition and adds data attributes to elements when they begin
// This enables transitionEnd to watch transitions which haven't begun
function watchTransition() {
  Event.on(document, 'transitionstart', function(event) {
    event.target.dataset.isTransitioning = true
  })
  Event.on(document, 'transitionend', function(event) {
    event.target.removeAttribute('data-is-transitioning')
  })
}

// This requires trackElementTransition to be enabled
function afterTransition(el, callback, startTimeout) {
  // transition has already begun
  if (el.dataset.isTransitioning || el.querySelector('[data-is-transitioning]')) {

    // Watch for end
    Event.one(el, 'transitionend', callback)

  // Transition has not yet begun so…
  } else {

    // startTimeout is meant to ensure that a callback is fired even if
    // an transition event, or in the case that an transition event is never triggered
    // this might happen if a user wants to fire a callack after an element animates
    // or fire the callback anyway if the element doesn't have an transition.
    if (startTimeout) {

      // Set a default timeout (allowing startTimeout == true or a specified number of milisecons)
      var time = ((typeof startTimeout == "number") ? startTimeout : 32) // 32ms: ~ two frames of transition grace period

      var delayedEvent = delay(function() {
        // Stop watching for transition to start
        // Why? - If the transition starts later, the callback will fire twice
        Event.off(el, 'transitionstart', watchEndEvent)
        callback()
      }, time)
    }

    // Next:
    // Register a function to attach callback to transitionEnd event
    function watchEndEvent () {
      if (startTimeout) delayedEvent.stop()    // cancel delayed fire
      Event.one(el, 'transitionend', callback) // watch for transition to finish
    }

    // Finally, when the transition does start, watch for its end
    Event.one(el, 'transitionstart', watchEndEvent)
  }
}

afterTransition.watch = watchTransition

module.exports = afterTransition
