var bean = require( 'bean' )
var throttle = require( './throttle' )

var onReady = []
var onResizing = []
var onChange = []
var onScroll = []
var readyAlready = false
var scrollWatch = false
var resizeWatch = false
var pageChangeFired = false

module.exports = {
  ready: ready,
  change: change
}

function ready( fn ) {
  if ( readyAlready )
    fn()
  else
    onReady.push( fn )
}

function change( fn ) {
  onChange.push( fn )

  // Execute immediately if pageChange has already fired
  if ( pageChangeFired ) 
    fn()
}

function scroll( fn ) {
  onScroll.push( fn )

  if ( !scrollWatch ) {
    scrollWatch = true
    bean.on( window, 'scroll', throttle( scrolled ) )

    // Trigger a custom event to allow easy listening for paint ready scroll events.
    bean.fire( window, 'optimizedScroll' )
  }
}

function resize( fn ) {
  onResizing.push( fn )

  if ( !resizeWatch ) {
    resizeWatch = true
    bean.on( window, 'resize', throttle( scrolled ) )

    // Trigger a custom event to allow easy listening for paint ready resize events.
    bean.fire( window, 'optimizedResize' )
  }
}

function pageReady(){

  readyAlready = true
  onReady.forEach( function( fn ) { fn() } )

  if ( !window.Turbolinks && !pageChangeFired ) { pageChange() }

}

function scrolled() {
  onScroll.forEach( function( fn ) { fn() } )
}

function pageChange(){

  pageChangeFired = true
  onChange.forEach( function( fn ) { fn() } )

}

bean.on( document, 'DOMContentLoaded', pageReady )
bean.on( document, 'page:change', pageChange )     // Support rails turbolinks page load event
