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
  fire: fire,
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

function fire () {
  args = slice.call(arguments)
  var el = args[0]
  var events = []

  args[1].split(' ').forEach(function(event) {
    var event = animationEvent.transform(event)
    if (!isEmpty(event)) events.push(event)
  })

  if (!isEmpty(events)) {
    bean.fire(args[0], events.join(' '))
  }
}

function setEvent(registerType, args) {
  var fn = bean[registerType]
  // Process animation events for browser-support
  args = transformArgs(args)
  var events = args[1]

  for (event in events) {
    fn.apply(this, [args[0], events[event], args[2]])
  }
}

function setEvent(registerType, args) {
  // Process animation events for browser-support
  args = transformArgs(args)
  var events = args.pop()

  for (event in events) {
    var beanArgs = args
    // Add event listener type as second parameter
    beanArgs.splice(1, 0, event)

    // Add event callback as last parameter
    beanArgs.push(events[event])

    bean[registerType].apply(null, beanArgs)
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

function getFunction(args) {
  if (typeof args[3] == 'function') {
    return args[3]
  } else if (typeof args[2] == 'function'){
    return args[2]
  }
  return null
}

function getDelegateSelector(args) {
  if (typeof args[2] == 'string') {
    return args[2]
  }
}

// Transform event arguments to handle tap event and cross-browser animation events
//
function transformArgs(args) {
  var newEvents = {}
  var newArgs = [args[0]]
  var events = args[1]
  var delegate = getDelegateSelector(args)

  if (delegate) newArgs.push(delegate)

  // convert event strings to object based events for code simplification
  // example: arguments ('hover focus', function) would become ({ 'hover focus': function })
  if (typeof events == 'string') {
    var objEvents = {}
    objEvents[events] = getFunction(args)
    events = objEvents
  }

  // Walk through each key in the events object and add vendor prefixes to 'animation' events
  // and wrap callback in the tap function for all 'tap' events.
  //
  for (event in events) {
    if (events.hasOwnProperty(event)) {
      var callback = events[event]

      // Events can be registered as space separated groups like "hover focus"
      // This handles each event independantly
      //
      event.split(' ').forEach(function(e){

        // If it is an animation event, vendor prefix it, or fire the callback according to browser support
        e = animationEvent.transform(e)

        if (isEmpty(e)) {
          // If it's empty, it has been removed since animation events are not supported.
          // In that case, trigger the event immediately
          callback()

        } else if (e.match(/tap/)) {

          // If it's a tap event, wrap the callback and set the event to 'touchstart'
          // Tap isn't a real native event, but this wrapper lets us simulate what a
          // native tap event would be.
          //
          newEvents['touchstart'] = tap(callback)
        } else {
          newEvents[e] = callback
        }
      })
    }
  }

  newArgs.push(newEvents)

  return newArgs
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
