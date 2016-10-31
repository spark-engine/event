var now = function() {
  return Date.now()
}

var delay = function ( fn, wait ) {

  var argsStart = ( wait != null ) ? 2 : 1;
  var handle = {}

  handle.args  = Array.prototype.slice.call( arguments, argsStart )
  handle.wait  = wait || 0
  handle.start = now()

  handle.stop  = function () {
    if ( "value" in handle ) {
      cancelAnimationFrame( handle.value );
    }
  }

  handle.loop  = function () {

    // If wait limit has been reached
    if ( now() - handle.start >= handle.wait ) {
      fn.apply( fn, handle.args )

      // If repeat is set and is not 0
      if ( !!handle.repeat ) {
        handle.repeat = handle.repeat - 1
        handle.start = now()
        queueDelay( handle )
      } else if ( handle.repeat === 0 && handle.complete ) {
        handle.complete()
      }

    } else {
      queueDelay( handle )
    }

  }


  return queueDelay( handle )
}

var queueDelay = function ( handle ) {
  handle.value = requestAnimationFrame( handle.loop )
  return handle
}

module.exports = delay
