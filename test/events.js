var assert = require('chai').assert
var event = require('../')
var sinon = require('sinon')
window.env = 'test'

document.querySelector('body').innerHTML = '<div id="test"></div>'
var testEl = document.querySelector('#test')

describe('Events', function(){
  var called = false

  it('should trigger document ready function', function(done){
    event.ready(function(){ testEl.textContent = "Document Ready Fired" })

    event.fire(document, 'DOMContentLoaded')
    assert.equal(testEl.textContent, 'Document Ready Fired')
    done()
  })
  
  it('should fire event', function(done){
    // Standard event listener
    event.on(document, 'test', '#test', function() {
      testEl.textContent = 'regular event'
    })

    event.fire(testEl, 'test')
    assert.equal(testEl.textContent, 'regular event')
    done()
  })

  it('should fire event with arguments', function(done){
    // Standard event listener
    event.on(document, 'testarg', '#test', function(event, val) {
      testEl.textContent = 'regular event + ' + val
    }, 'argument')

    event.fire(testEl, 'testarg')
    assert.equal(testEl.textContent, 'regular event + argument')
    done()
  })

  it('should use capture if useCapture is true', function(done) {
    var addEventListenerSpy = sinon.spy(document, 'addEventListener'),
      mock = sinon.mock(),
      usedCapture

    event.on(document, 'click', '#test', mock, {useCapture: true})

    usedCapture = addEventListenerSpy.getCall(0).args[2]
    assert.isTrue(usedCapture)

    event.off(document, 'click', mock, {useCapture: true});
    document.addEventListener.restore()
    done()
  })

  it('should not use capture if useCapture is false', function(done) {
    var addEventListenerSpy = sinon.spy(document, 'addEventListener'),
      mock = sinon.mock(),
      usedCapture

    event.on(document, 'click', '#test', mock, {useCapture: false})

    usedCapture = addEventListenerSpy.getCall(0).args[2]
    assert.isFalse(usedCapture)

    event.off(document, 'click', mock);
    document.addEventListener.restore()
    done()
  })

  it('should not use capture if useCapture is unspecified', function(done) {
    var addEventListenerSpy = sinon.spy(document, 'addEventListener'),
      mock = sinon.mock(),
      usedCapture

    event.on(document, 'click', '#test', mock)

    usedCapture = addEventListenerSpy.getCall(0).args[2]
    assert.isFalse(usedCapture)

    event.off(document, 'click', mock);
    document.addEventListener.restore()
    done()
  })
  
  it('should fire event once', function(done){
    // Single event listener
    event.one(testEl, 'testonce', function() {
      if(!called) {
        testEl.textContent = 'called once'
      } else {
        testEl.textContent = 'called twice'
      }
      called = true
    })

    event.fire(testEl, 'testonce')
    assert.equal(testEl.textContent, 'called once')
    event.fire(testEl, 'testonce')
    assert.equal(testEl.textContent, 'called once')
    called = false
    done()
  })

  it('should fire object event', function(done){
    // Object event listener
    event.on(document, {
      testobject: function() { testEl.textContent = 'object event' }
    })

    event.fire(document, 'testobject')
    assert.equal(testEl.textContent, 'object event')
    done()
  })

  it('should fire object event with delegation and arguments', function(done){
    var arg = 'test arg'

    // Object event listener
    event.on(document, {
      testobjectargs: function(event, arg) { testEl.textContent = 'object event ' + arg }
    },'#test', 'test arg')

    event.fire(testEl, 'testobjectargs')
    assert.equal(testEl.textContent, 'object event test arg')
    done()
  })

  it('should fire and remove an event', function(done){
    event.on(testEl, 'testoff', function() {
      if(!called) {
        testEl.textContent = 'called once'
      } else {
        testEl.textContent = 'called twice'
      }
      called = true
    })

    event.fire(testEl, 'testoff')
    assert.equal(testEl.textContent, 'called once')

    event.off(testEl,  'testoff')
    event.fire(testEl, 'testoff')
    assert.equal(testEl.textContent, 'called once')
    called = false
    done()
  })

  it('should fire an animation event', function(done){
    event.on(document, 'animationend', '#test', function() {
      testEl.textContent = 'animation end'
    })

    event.fire(testEl, 'animationend')
    assert.equal(testEl.textContent, 'animation end')
    done()
  })
})
