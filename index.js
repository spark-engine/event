var bean = require('bean')
var key = require('keymaster')
var animationEvent = require('./lib/animation-events.js')
var page = require('./lib/page-events.js')
var slice = Array.prototype.slice

module.exports = {
  on: on,
  off: off,
  one: one,
  fire: bean.fire,
  clone: bean.clone,
  ready: page.ready,
  change: page.change,
  key: key,
  onKey: key,
  offKey: key.unbind,
  oneKey: oneKey
}

function on () {
  var args = transformArgs(slice.call(arguments))
  if(args) {
    bean.on.apply(null, args)
  }
}

function off () {
  var args = transformArgs(slice.call(arguments))

  if(args) {
    bean.off.apply(null, args)
  }
}

function one () {
  var args = transformArgs(slice.call(arguments))

  if(args) {
    bean.one.apply(null, args)
  }
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

// Ensure
function transformArgs(args) {
  var newEvents = {}
  var events = args[1]

  // Bean can accept events like { click: function(){},... }
  // This ensures that the keys are transformed to support
  // cross browser animation events.
  //
  if (typeof events == 'object') {
    for (type in events) {
      if (events.hasOwnProperty(type)) {

        // Adds vendor prefixes or calls function if browser doesn't support animation events
        transformed = transformAnimationEvents(type, events[type])

        if (transformed.length > 0) {
          newEvents[transformed] = events[type]
        }
      }
    }
    args[1] = newEvents
  } else {
    args[1] = transformAnimationEvents(events, args[3] || args[2])
  }

  if (!isEmpty(args[1])) return args

}

// Browser support: As necessary add vendor prefixes or camelCased event names
//
function transformAnimationEvents (events, fn) {
  eventTypes = []
  
  events.split(' ').forEach(function(e){
    if (e.match(/animation/i)) {

      if(!animationEvent.supported) { 

        if(window.env != 'test') {
          console.error('Animation events are not supported')
        }

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

function isEmpty(obj) {
  var hasOwnProperty = Object.prototype.hasOwnProperty

  if (obj == null || obj.length === 0) return true
  if (0 < obj.length) return false

  for (var key in obj) {
    if (hasOwnProperty.call(obj, key)) return false
  }

  return true;
}
