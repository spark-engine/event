var manager = require('./event-manager')
var scroll  = manager.new('scroll')

scroll.disablePointer = function() {

  // Disable pointer interaction
  scroll.start(function() {
    document.documentElement.style.pointerEvents = 'none'
  })

  // Enable pointer interaction
  scroll.end(function() {
    document.documentElement.style.pointerEvents = ''
  })
}

module.exports = scroll
