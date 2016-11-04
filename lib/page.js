var Event           = require( 'bean' )
var callbackManager = require( './callback-manager' )
var readyAlready    = false
var pageChanged     = false

// Create a new page event manager
var manager = callbackManager.new()

manager.add( function(){
  readyAlready = true
  if ( !window.Turbolinks && !pageChanged ) { manager.fire( 'change' ) }
}, 'ready' )

manager.add( function(){
  pageChanged = true
}, 'change' )

function ready( fn ) {
  if ( readyAlready ) { fn() }
  return manager.add( fn, 'ready' ) }

function change( fn ) {
  if ( pageChanged ) { fn() }
  return manager.add( fn, 'change' )
}

Event.on( document, 'DOMContentLoaded', function() { manager.fire( 'ready') } )
Event.on( document, 'page:change', function() { manager.fire( 'change' ) } )     // Support rails turbolinks page load event

module.exports = {
  ready: ready,
  change: change
}
