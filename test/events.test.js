var assert = require('chai').assert
var event = require('../')
window.env = 'test'

document.querySelector('body').innerHTML = '<div id="test"></div>'
var testEl = document.querySelector('#test')

function reset() {
  event.off(document)
  document.querySelector('body').innerHTML = '<div id="test"></div>'
  called = false
  return document.querySelector('#test')
}

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

  it('should fire an animation event once', function(done){
    event.one(document, 'animationstart', '#test', function() {
      if(!called) {
        testEl.textContent = 'animation called once'
      } else {
        testEl.textContent = 'animation called twice'
      }
      called = true
    })

    event.fire(testEl, 'animationstart')
    assert.equal(testEl.textContent, 'animation called once')
    event.fire(testEl, 'animationstart')
    assert.equal(testEl.textContent, 'animation called once')
    called = false
    done()
  })
})
