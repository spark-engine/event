var now = function() {
  return Date.now()
}

var pickFunction = function() {
  var found
  Array.prototype.forEach.call( arguments, function( candidate ) {
    if ( typeof( candidate ) == 'function' && !found ) { found = candidate }
  })

  return found
}

var debounce = function( fn, wait, options ) {

  // Allow options passed as the first argument
  if ( typeof( fn ) == 'object' ) { options = fn } 

  // Options won't be null
  else { options = options || {} }

  wait = options.wait || wait || 0

  var max            = options.max || false,
      leading        = ( ( 'leading'  in options ) ? options.leading  : false ),
      trailing       = ( ( 'trailing' in options ) ? options.trailing : true ),
      
      // Grab functions from options or default to first argument
      leadingFn      = pickFunction( options.leading, options.trailing, options.callback, fn ),
      trailingFn     = pickFunction( options.trailing, options.leading, options.callback, fn ),

      // State tracking vars
      args,                    // Track arguments passed to debounced callback
      queued         = false,  // Has a callback been added to the animation loop?
      handle         = {},     // Object for tracking functions and callbacks
      lastCalled     = 0,      // Keep a timer for debouncing
      lastInvoked    = 0,      // Keep a timer for max
      leadingBlocked = false;  // Track leading, throttling subsequent leading calls

  // Queue the function with requestAnimationFrame
  var invoke = function( callType ) {

    lastCalled = now()
    lastInvoked = now()
    queued = false
    leadingBlocked = true

    if ( callType === 'leading' ) {
      leadingFn.apply( leadingFn, args ) }
    else {
      trailingFn.apply( trailingFn, args ) }

  }

  // Load the loop into the animation queue
  var addToQueue = function () {

    if ( !queued ) {
      queued = true
      handle.value = requestAnimationFrame( loop )  // Add to browser's animation queue
    }

  }

  // Remove from animation queue and reset debounce 
  var removeFromQueue = function() {

    if ( "value" in handle ) {
      cancelAnimationFrame( handle.value )
      queued         = false
      lastCalled     = 0
      lastInvoked    = 0
      leadingBlocked = false
    }
    
  }

  // prevent infinite debouncing ( if options.max is set )
  var maxPassed = function() {
    return ( max && now() - lastInvoked >= max )
  }

  var waitReached = function() {
    return ( now() - lastCalled ) >= wait
  }

  // This gets loaded into the animation queue and determines whether to ivoke the debounced function
  var loop = function () {
  
    // Loop was executed so it's no longer in the animation queue
    queued = false
    
    if ( leading && !leadingBlocked ) {
      invoke( 'leading' )
    }

    // If function has been called to frequently to execute
    else if ( maxPassed() ) {

      if ( leading ) { invoke( 'leading' )  }
      else           { invoke( 'trailing' ) }

    } 
    
    // If function hasn't been called since last wait
    else if ( waitReached() ) {

      // If trailing it's safe to invoke
      if ( trailing ) { invoke( 'trailing' ) }

      // If leading, it's safe to remove block
      if ( leading )  { leadingBlocked = false }
     
    } else {
      addToQueue()
    }

  }

  // A wrapper function for queueing up function calls
  //
  var debounced = function() {
    lastCalled = now()
    args = arguments
    addToQueue()
  }

  debounced.stop = removeFromQueue

  return debounced
}

module.exports = debounce
