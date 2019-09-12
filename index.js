require('./lib/shims/custom-event')

var bean = require('@spark-engine/bean'),
    key  = require('keymaster'),
    afterAnimation    = require('./lib/after-animation'),
    page              = require('./lib/page'),
    tap               = require('./lib/tap-events'),
    debounce          = require('./lib/debounce'),
    throttle          = require('./lib/throttle'),
    delay             = require('./lib/delay'),
    repeat            = require('./lib/repeat'),
    bubbleFormEvents  = require('./lib/bubble-form-events'),
    submit            = require('./lib/submit'),
    scroll            = require('./lib/scroll'),
    resize            = require('./lib/resize'),
    callbackManager   = require('./lib/callback-manager'),
    eventManager      = require('./lib/event-manager'),
    media             = require('./lib/media'),

    slice             = Array.prototype.slice,
    formBubbling      = false,
    watchAnimation    = true

module.exports = {

  // DOM events
  on: bean.on,
  off: bean.off,
  one: bean.one,
  fire: bean.fire,
  clone: bean.clone,
  ready: page.ready,
  change: page.change,
  beforeVisit: page.beforeVisit,
  beforeChange: page.beforeChange,
  beforeUnload: page.beforeUnload,
  afterAnimation: afterAnimation,
  watchAnimation: watchAnimation,

  // Media query events
  media: media,

  // Keyboard events
  key: key,
  keyOn: key,
  keyOff: key.unbind,
  keyOne: keyOne,

  // Timing utilities
  debounce: debounce,
  throttle: throttle,
  delay:    delay,
  repeat:   repeat,

  // Optimized Event Managers
  scroll:      scroll,
  resize:      resize,
  eventManager: eventManager,

  callbackManager: callbackManager,
  callback: callbackManager.callback,

  // Bubbling fix
  bubbleFormEvents: bubbleFormEvents,

  submit: submit
}

page.ready(function() {
  if (watchAnimation) afterAnimation.watch()
})

// Add support for unbinding a key event after it is called
//
function keyOne (keys, scope, fn) {

  if (typeof scope == 'function') {
    fn = scope
    scope = 'all'
  }

  key(keys, scope, function( event) {
    key.unbind(keys, scope)
    fn(event)
  })
}
