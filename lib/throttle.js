var debounce = require( './debounce' )

var throttle = function( fn, wait, options ) {

  options = options || {}
  wait = wait || 0

  leading = 'leading' in options ? !!options.leading : true;
  trailing = 'trailing' in options ? !!options.trailing : true;

  return debounce( fn, wait, {
    'leading': leading,
    'maxWait': wait,
    'trailing': trailing
  })
}

module.exports = throttle
