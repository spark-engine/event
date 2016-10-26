var now = function() {
  return Date.now()
}

var timeout = {
  set: function( fn, delay ) { var args   = Array.prototype.slice.call(arguments, 2),
        start  = now(),
        handle = {};

    var loop = function () {
      if ( now() - start >= delay ) {
        fn.apply( fn, args )
      } else {
        handle.value = requestAnimationFrame( loop );
      }
    }

    handle.value = requestAnimationFrame( loop );
    return handle
  },

  clear : function( handle ) {
    cancelAnimationFrame( handle.value );
  }
}

module.exports = timeout
