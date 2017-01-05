var Event           = require( 'bean' )
var callbackManager = require( './callback-manager' )

// Create a new page event manager
var manager = {
  ready: callbackManager.new(),
  change: callbackManager.new(),
  readyAlready: false,
  changed: false,
}

manager.ready.add( function(){
  manager.readyAlready = true 
})

manager.ready.add( function(){ 
  if ( !window.Turbolinks && !manager.changed ) { 
    manager.changed = true 
    manager.change.fire()
  }
})

var ready = function ( fn ) {
  if ( manager.readyAlready ) { fn() }
  return manager.ready.add( fn ) }

var change = function( fn ) {
  if ( manager.changed ) { fn() }
  return manager.change.add( fn ) }

// Make it easy to trigger ready callbacks
ready.fire = function () {
  manager.ready.fire()
  // Be sure ready can only be fired once
  manager.ready.stop() }

// Make it easy to trigger change callbacks
change.fire = function () {
  manager.change.fire() }

Event.on( document, 'DOMContentLoaded', ready.fire )
Event.on( document, 'page:change', change.fire )     // Support rails turbolinks page load event

module.exports = {
  ready: ready,
  change: change
}
