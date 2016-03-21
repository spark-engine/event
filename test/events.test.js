var assert = require('chai').assert
var event = require('../')

describe('Event', function(){
  before(function(){
    event.load(function(){ document.write('hi') })
  })
  it('Load function works', function(){
    assert.equal(document.textContent, 'hi')
  })
})

