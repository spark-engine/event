var Event           = require( 'bean' )
var callbackManager = require( './callback-manager' )
var throttle        = require( './throttle' )
var debounce        = require( './debounce' )

var optimizedEventManager = {
  new: function( name ) {

    // Create a new callback manager
    var manager = {
      run: callbackManager.new(),
      start: callbackManager.new(),
      stop: callbackManager.new()
    }

    // run callbacks when event happens (at paint-ready frames)
    var running = throttle( manager.run.fire )

    // fire callbacks when event starts (at paint-ready frames)
    var started = debounce({
      leading: manager.start.fire,
      trailing: false,
      wait: 150
    })

    // fire callbacks when event starts (at paint-ready frames)
    var stopped = debounce( manager.stop.fire, 150 )

    Event.on( window, name, function() {
      running()
      started()
      stopped()
    })

    // Public API
    var run   = function ( fn ) { return manager.run.add( fn ) }
    run.start = function ( fn ) { return manager.start.add( fn ) }
    run.stop  = function ( fn ) { return manager.stop.add( fn ) }

    // Add custom events for to run optimized listeners. ( name -> Name )
    run( function() { Event.fire( window, 'optimized' +  name[0].toUpperCase() + name.substring(1) ) } )
    run.start( function() { Event.fire( window, name + 'Start' ) } )
    run.stop( function() { Event.fire( window, name + 'Stop' ) } )

    return run
  }
}

module.exports = optimizedEventManager
