var delay = require( './delay' )

var repeat = function( fn, wait, limit ) {

  var argsStart = 1,
      handle = delay ( fn, wait );

  if      ( limit != null ) { argsStart = 3 }
  else if ( wait  != null ) { argsStart = 2 }

  // Enable repeat ( -1 will repeat forever )
  handle.repeat = limit || -1
  handle.args   = Array.prototype.slice.call( arguments, argsStart )
  handle.stop   = handle.cancel

  return handle
}

module.exports = repeat
