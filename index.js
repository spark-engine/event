var bean = require( 'bean' )
var key  = require( 'keymaster' )

var animationEvent    = require( './lib/animation-events.js' )
var page              = require( './lib/page.js' )
var tap               = require( './lib/tap-events.js' )
var debounce          = require( './lib/debounce' )
var throttle          = require( './lib/throttle' )
var delay             = require( './lib/delay' )
var repeat            = require( './lib/repeat' )
var bubbleFormEvents  = require( './lib/bubble-form-events' )
var scrollEvent       = require( './lib/scroll' )
var resizeEvent       = require( './lib/resize' )
var callbackManager   = require( './lib/callback-manager' )

var slice             = Array.prototype.slice
var formBubbling      = false

module.exports = {

  // DOM events
  on: on,
  off: off,
  one: one,
  fire: fire,
  clone: bean.clone,
  ready: page.ready,
  change: page.change,

  // Keyboard events
  key: key,
  keyOn: key,
  keyOff: key.unbind,
  keyOne: keyOne,

  // Timing utilities
  debounce: debounce,
  throttle: throttle,
  delay: delay,
  repeat: repeat,

  // Scroll Event Managers
  scroll:      scrollEvent.scroll,
  startScroll: scrollEvent.start,
  stopScroll:  scrollEvent.stop

  // Resize Event Managers
  resize:      resizeEvent.resize,
  startResize: resizeEvent.start,
  stopResize:  resizeEvent.stop,

  callbackManager: callbackManager,

  // Bubbling fix
  bubbleFormEvents: bubbleFormEvents
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
    args[1] = events.join( ' ' )
    bean.fire.apply( this, args )
  }
}

function setEvent(registerType, args) {
  transformArgs(args).forEach(function(arg) {
    bean[registerType].apply(null, arg)
  })
}

// Add support for unbinding a key event after it is called
//
function keyOne (keys, scope, fn) {
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
// Returns an array of events to be registered individually
//
function transformArgs(args) {
  var transformedArgs = []
  var newEvents = {}
  var element = args.shift() // retrieve element
  var events = args.shift()

  // detect event delegate selector
  if (typeof args[0] != 'function') {
    var delegate = args.shift()
  }

  // convert event strings to object based events for code simplification
  // example: arguments ('hover focus', function) would become ({ 'hover focus': function })
  if (typeof events == 'string') {
    var objEvents = {}
    objEvents[events] = args.shift()
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
          newEvents.touchstart = tap(callback)
        } else {
          newEvents[e] = callback
        }
      })
    }
  }

  for (event in newEvents) {
    var a = []
    a.push(element, event)
    if (delegate) a.push(delegate)
    a.push(newEvents[event])
    transformedArgs.push(a.concat(args))
  }

  return transformedArgs
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
