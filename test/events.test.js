var assert = require('chai').assert
var event = require('../')

document.querySelector('body').innerHTML = '<div id="test"></div>'
var testEl = document.querySelector('#test')

describe('DomReady', function(){
  before(function(){
    event.ready(function(){ testEl.textContent = "Document Ready Fired" })
  })
  it('Document ready function works', function(){
    event.fire(document, 'DOMContentLoaded')
    assert.equal(testEl.textContent, 'Document Ready Fired')

  })
})

describe('Test regular event', function(){
  before(function(){
    event.on(document, 'dang', '#test', function() {
      testEl.textContent = 'regular event'
    })
  })

  it('Test regular event', function(){
    event.fire(testEl, 'dang')
    assert.equal(testEl.textContent, 'regular event')
  })
})

// PhantomJS doesn't do animation events, but this should pass because
// no support for animation events means that it will fire them immediately
describe('Test animation event failure', function(){
  before(function(){
    event.on(document, 'animationend', '#test', function() {
      testEl.textContent = 'animation end'
    })
  })

  it('Test regular event', function(){
    event.fire(testEl, 'animationend')
    assert.equal(testEl.textContent, 'animation end')
  })
})

