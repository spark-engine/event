var Event = require( 'bean' )

var readyCallbacks = []
var changeCallbacks = []
var readyAlready = false
var pageChangeFired = false

function ready( fn ) {
  if ( readyAlready )
    fn()
  else
    readyCallbacks.push( fn )
}

function change( fn ) {
  changeCallbacks.push( fn )

  // Execute immediately if pageChange has already fired
  if ( pageChangeFired )
    fn()
}

function pageReady(){

  readyAlready = true
  readyCallbacks.forEach( function( fn ) { fn() } )

  if ( !window.Turbolinks && !pageChangeFired ) { pageChange() }

}

function pageChange(){

  pageChangeFired = true
  changeCallbacks.forEach( function( fn ) { fn() } )

}

Event.on( document, 'DOMContentLoaded', pageReady )
Event.on( document, 'page:change', pageChange )     // Support rails turbolinks page load event

module.exports = {
  ready: ready,
  change: change
}

