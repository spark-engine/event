var now = function() {
  return Date.now()
}

var throttle = function( fn, delay ) {

  var start  = now(),
      queued = false,
      handle = {};
  
  // Queue the function with requestAnimationFrame
  var invoke = function() {
    var args = arguments
    queued = true

    // Return the wrapped function to store its handle
    return requestAnimationFrame( function() {
      fn.apply( fn, args )
      start = now()
      queued = false
    })
  }

  var throttled = function() {

    if ( delay ) {

      // First run, or delayed
      if ( !handle.value || now() - start >= delay ) {
        handle.value = invoke.apply( fn, arguments )
      } } 
    // Invoke in sync requestAnimationFrame 
    else if ( !queued ) {
      handle.value = invoke.apply( fn, arguments )
    }
  }

  throttled.stop = function() {
    if ( !handle.value ) { return }
    window.cancelAnimationFrame( handle.value )
  }

  return throttled
}

module.exports = throttle
