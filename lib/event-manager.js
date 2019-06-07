var Event           = require( '@spark-engine/bean' )
var Page            = require( './page' )
var callbackManager = require( './callback-manager' )
var throttle        = require( './throttle' )
var debounce        = require( './debounce' )

var eventManager = {
  new: function( name, options ) {

    options = options || {}
    var target = options.target || window
    var delay = options.delay || 150
    var optimize = options.throttle || true

    // Create a new callback manager
    var manager = {
      run: callbackManager.new(),
      start: callbackManager.new(),
      end: callbackManager.new()
    }

    var running = manager.run.fire

    // run callbacks when event happens (at paint-ready frames)
    if (optimize) running = throttle( running )

    // fire callbacks when event starts (at paint-ready frames)
    var started = debounce({ leading: manager.start.fire, trailing: false, wait: delay })

    // fire callbacks when event starts (at paint-ready frames)
    var ended = debounce( manager.end.fire, delay )

    // Public API
    var run   = function ( fn ) { return manager.run.add( fn ) }
    run.start = function ( fn ) { return manager.start.add( fn ) }
    run.end   = function ( fn ) { return manager.end.add( fn ) }

    Page.ready(function(){
      if ( typeof target === "string" ) target = document.querySelector(target)

      if ( target ) {
        // These functions use throttle and debounce to only trigger on optimzied intervals and at start and end
        Event.on( target, name, function(event) {
          started(event)
          running(event)
          ended(event)
        })
      }
    })

    return run
  }
}

module.exports = eventManager
