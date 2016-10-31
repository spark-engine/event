var now = function() {
  return Date.now()
}

var defaults = {
  leading: false,
  trailing: true
}

var debounce = function( fn, wait, options ) {
  options = options || {}

  var queued      = false,
      leading     = false,
      trailing    = true,
      maxTime     = options.maxTime || false,
      leadingBlocked = false,
      lastInvoked = 0,
      handle      = {},
      args;

  if ( 'leading' in options )  { leading = options.leading }
  if ( 'trailing' in options )  { trailing = options.trailing }
  
  // Queue the function with requestAnimationFrame
  var invoke = function() {
    fn.apply( fn, args )
    lastCalled = now()
    lastInvoked = now()
    queued = false
  }

  // Load the loop into the animation queue
  var addToQueue = function () {
    if ( !queued ) {
      queued = true
      handle.value = requestAnimationFrame( loop )
    }
  }

  var removeFromQueue = function() {
    if ( "value" in handle ) {
      cancelAnimationFrame( handle.value )
      queued = false
      leadingBlocked = false
    }
  }

  // prevent infinite debouncing ( if options.maxTime is set )
  var maxTimePassed = function() {
    return ( maxTime && now() - lastInvoked >= maxTime )
  }

  var waitReached = function() {
    return  maxTimePassed() || now() - lastCalled >= wait
  }

  // This gets loaded into the animation queue and determines whether to ivoke the debounced function
  //
  var loop = function () {

    // Loop was executed so it's no longer in the animation queue
    queued = false

    if ( leading && !leadingBlocked ) {
      leadingBlocked = true
      invoke()
    }

    if ( !waitReached() ) { 

      addToQueue()

    } else {

      // If trailing it's safe to invoke
      if ( trailing ) { invoke() }

      // If leading, it's safe to remove block
      if ( leading )  { leadingBlocked = false }
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
