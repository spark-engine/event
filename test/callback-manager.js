var assert = require('chai').assert
var event = require('../')
var manager = event.callbackManager.new()

var injectHTML = function(html) {
  document.body.insertAdjacentHTML('beforeend', html)
  return document.body.lastChild
}

describe('callback-manager', function(){
  var $el = injectHTML( '<div data-cb1=0 data-cb2=0 ></div>' )

  var increment = function( attr ) {
    $el.dataset[attr] = Number($el.dataset[attr]) + 1
  }

  var increment1 = function() { increment('cb1') }
  var increment2 = function() { increment('cb2') }

  beforeEach(function() {
    $el.dataset.cb1 = 0
    $el.dataset.cb2 = 0
    manager.removeAll()
  })

  it('fires callbacks', function(){
    var h = manager.add( increment1 )
    manager.fire()
    assert.equal( $el.dataset.cb1, 1 )

    manager.fire()
    assert.equal( $el.dataset.cb1, 2 )
  })

  it('fires grouped callbacks', function(){
    var ha = manager.add( increment1, 'a' )
    var hb = manager.add( increment2, 'b' )

    manager.fire()
    assert.equal( $el.dataset.cb1, 1 )
    assert.equal( $el.dataset.cb2, 1 )

    manager.fire( 'a' )
    assert.equal( $el.dataset.cb1, 2 )
    assert.equal( $el.dataset.cb2, 1 )

    manager.fire( 'b' )
    assert.equal( $el.dataset.cb1, 2 )
    assert.equal( $el.dataset.cb2, 2 )
  })

  it('stops and starts a callback', function(){
    var h = manager.add( increment1 )

    manager.fire()
    assert.equal( $el.dataset.cb1, 1 )

    h.stop()        // stop callback execution
    manager.fire()  // should be ineffective
    manager.fire()  // should be ineffective

    assert.equal( $el.dataset.cb1, 1 ) // no change

    h.start()       // enable callback execution
    manager.fire()
    assert.equal( $el.dataset.cb1, 2 ) // callback works
  })

})
