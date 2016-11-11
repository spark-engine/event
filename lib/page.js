var Event           = require( 'bean' )
var callbackManager = require( './callback-manager' )

// Create a new page event manager
var manager = {
  ready: callbackManager.new(),
  change: callbackManager.new(),
  readyAlready: false,
  changed: false
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

function ready( fn ) {
  if ( manager.readyAlready ) { fn() }
  return manager.ready.add( fn ) }

function change( fn ) {
  if ( manager.changed ) { fn() }
  return manager.change.add( fn )
}

Event.on( document, 'DOMContentLoaded', manager.ready.fire )
Event.on( document, 'page:change', manager.change.fire )     // Support rails turbolinks page load event

module.exports = {
  ready: ready,
  change: change
}
