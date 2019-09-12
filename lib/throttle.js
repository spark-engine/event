var debounce = require('./debounce')

var throttle = function(fn, wait, options) {

  if (typeof(fn) == 'object') { options = fn; fn = undefined } 
  else { options = options || {} }

  options.wait = options.wait || wait || 0
  options.max  = options.max || options.wait
  options.callback = options.callback || fn
  options.leading  = true
  options.trailing = true

  return debounce(options)
}


module.exports = throttle
