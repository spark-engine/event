var bean = require('bean')
var key = require('keymaster')
var animationEvent = require('./lib/animation-events.js')
var page = require('./lib/page-events.js')
var tap = require('./lib/tap-events.js')
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

// Bean doesn't account for cross-browser support on animation events
// So rather than pass through events to bean, we process them to add
// vendor prefixes or remove events if browsers do not suppor them
//
function on () {
  setEvent('on', slice.call(arguments))
}

function off () {
  setEvent('off', slice.call(arguments))
}

function one () {
  setEvent('one', slice.call(arguments))
}

function setEvent(type, args) {
  // Process animation events for browser-support
  args = transformArgs(args)

  // If no events remain (Because of no browser support)
  // do not register events
  if( !isEmpty(args[1]) ) {
    bean[type].apply(null, args)
  }
}

// Add support for unbinding a key event after it is called
//
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

// Transform event arguments to handle tap event and cross-browser animation events
//
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
        var callback = events[type]

        // Adds vendor prefixes or calls function if browser doesn't support animation events
        //
        var transformed = animationEvent.transform(type, callback)

        // Walk through each event and if it should be a tap event
        // replace the callback with a tap wrapped callback
        //
        if (transformed.match(/tap/)) {
          var remainingEvents = []

          transformed.split(' ').forEach(function(e){
            if (e.match(/tap/, '')) {
              // Direcly add the event as a tap event
              newEvents.touchstart = tap(callback)
            } else { 
              remainingEvents.push(e)
            }
          })
          transformed = remainingEvents.join(' ')
        }

        if (0 < transformed.length) {
          newEvents[transformed] = callback
        }
      }
    }

    args[1] = newEvents

  } else {

    // If events are just a string, replace animation events with with browser supported ones
    //
    args[1] = animationEvent.transform(events, args[3] || args[2])
  }

  return args
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
