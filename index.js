var bean = require('bean')
var animationEvent = require('./lib/animation-event.js')
var key = require('keymaster')

module.exports = {
  on: on,
  off: off,
  one: one,
  fire: bean.fire,
  clone: bean.clone,
  key: key,
  onKey: key,
  offKey: key.unbind,
  oneKey: oneKey
}

function on (element, events, selector, fn) {
  setEvent('on', element, events, selector, fn)
}

function off (element, events, selector, fn) {
  setEvent('off', element, events, selector, fn)
}

function one (element, events, selector, fn) {
  setEvent('one', element, events, selector, fn)
}

function oneKey (keys, scope, fn) {
  if (typeof scope == 'function') {
    fn = scope
    scope = 'all'
  }
  key(keys, scope, function(event) {
    key.unbind(keys, scope)
    fn(event)
  })
}

function setEvent(type, element, events, selector, fn) {

  // Add prefixes as necessary to animation events
  events = transformAnimationEvents(events, fn || selector)

  bean[type](element, events, selector, fn)
}

// Browser support: As necessary add vendor prefixes or camelCased event names
//
function transformAnimationEvents (events, fn) {
  eventTypes = []
  
  events.split(' ').forEach(function(e){
    if (e.match(/animation/i)) {

      if(!animationEvent.supported) { 

        console.error('Animation events are not supported')

        // If animation events aren't supported trigger immediately
        fn()

      } else if (animationEvent.types[e]) {
        
        // Fetch properly prefixed, cased event names from Animation Events lib
        eventTypes.push(animationEvent.types[e])

      } else {
        console.error('"' + e + '" is not a supported animation event')
      }
    } else {
      eventTypes.push(e)
    }
  })
  
  return eventTypes.join(' ')
}
