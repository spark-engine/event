var Event = require( 'bean' ),
    page  = require( './page' ),
    formEls;

var formBubbling = false

var fireBubble = function ( event ) {
  if ( event.detail && event.detail.triggered ) { return false }

  var ev = new CustomEvent( event.type, { bubbles: true, cancelable: true, detail: { triggered: true } } )

  event.stopPropagation()
  event.target.dispatchEvent( ev ) 

  // Prevent default on original event if custom event is prevented
  if ( ev.defaultPrevented ) event.preventDefault() 
}

function handleSubmit( event ) {
  event.preventDefault()
}

// Simplify setting the event type based on the element
var eventType = function ( el ) {
  return ( el.tagName == 'FORM' ) ? 'submit' : 'focus blur'
}

// Add event listeners
var bubbleOn = function ( el ) {
  Event.on( el, eventType( el ), fireBubble )
}

// Remove event listeners
var bubbleOff = function ( el ) {
  Event.off( el, eventType( el ), fireBubble )
}

// Add/Remove event listeners
var bubbleFormEvents = function () {
  if ( formBubbling ) { return }

  page.change( function() {

    // Remove listeners from previous page
    if ( formEls ) Array.prototype.forEach.call( formEls, bubbleOff )

    // Add new listeners to this page
    formEls = document.querySelectorAll( 'form, input' )

    Array.prototype.forEach.call( formEls, bubbleOn )
  })

  var formBubbling = true
}

module.exports = bubbleFormEvents
