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
    manager.remove()
  })

  it( 'pauses and resumes callbacks', function() {
    var cb = function() {
      $el.dataset[ arguments[ 0 ] ] = arguments[ 1 ]
    }

    cb = event.callback.new( cb )

    cb( 'cb1', 'awesome' )
    assert.equal( $el.dataset.cb1, 'awesome' )

    cb.stop()
    cb( 'cb1', 'cool' )
    assert.equal( $el.dataset.cb1, 'awesome' )

    cb.start()
    cb( 'cb1', 'cool' )
    assert.equal( $el.dataset.cb1, 'cool' )

  })

  it( 'toggles callbacks', function() {

    var cb = event.callback.new( function() {
      $el.dataset.cb1 = arguments[ 0 ]
    })

    assert.isTrue( cb.enabled )

    cb.toggle()
    assert.isFalse( cb.enabled )

    cb.toggle()
    assert.isTrue( cb.enabled )

    cb.toggle( false )
    assert.isFalse( cb.enabled )

    cb.toggle( true )
    assert.isTrue( cb.enabled )

  })

  it('fires manager callbacks', function(){
    var h = manager.add( increment1 )
    manager.fire()
    assert.equal( $el.dataset.cb1, 1 )

    manager.fire()
    assert.equal( $el.dataset.cb1, 2 )
  })

  it("stops and starts a manager's callback", function(){
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

  it('fires manager callbacks with arguments', function(){
    var h = manager.add( function() {
      $el.dataset[ arguments[ 0 ] ] = arguments[ 1 ]
    })
    manager.fire('cb1', 'test')
    assert.equal( $el.dataset.cb1, 'test' )

    manager.fire('cb2', 'test2')
    assert.equal( $el.dataset.cb2, 'test2' )
  })

})
