var Event = require("../")
var utils = require("./_utils")

$el = utils.injectHTML('<div id="test"></div>')

describe('Events', function(){
  it('should trigger document ready function', function(){
    var mockFn = jest.fn()
    Event.ready(mockFn)

    Event.fire(document, 'DOMContentLoaded')
    expect(mockFn.mock.calls.length).toBe(1)
  })

  it('should fire event', function(){
    var mockFn = jest.fn()
    Event.on(document, 'test', '#test', mockFn)

    Event.fire($el, 'test')
    expect(mockFn.mock.calls.length).toBe(1)
  })

  it('should fire event with arguments', function(){
    var mockFn = jest.fn()
    Event.on(document, 'testarg', '#test', mockFn, 'argument')

    Event.fire($el, 'testarg')
    expect(mockFn.mock.calls[0].length).toBe(2)
    expect(mockFn.mock.calls[0][1]).toBe('argument')

    Event.fire($el, 'testarg')
    expect(mockFn.mock.calls[0].length).toBe(2)
    expect(mockFn.mock.calls[0][1]).toBe('argument')
  })

  it('should use capture if useCapture is true', function() {
    var spy = jest.spyOn(document, 'addEventListener'),
        mockFn = jest.fn()

    Event.on(document, 'click', '#test', mockFn, {useCapture: true})
    expect(spy).toHaveBeenCalled()
    expect(spy.mock.calls[0][2]).toBe(true)
    
    Event.off(document, 'click', mockFn, {useCapture: true});
    spy.mockRestore()
  })

  it('should not use capture if useCapture is false', function() {
    var spy = jest.spyOn(document, 'addEventListener'),
        mockFn = jest.fn()

    Event.on(document, 'click', '#test', mockFn, {useCapture: false})
    expect(spy).toHaveBeenCalled()
    expect(spy.mock.calls[0][2]).toBe(false)
    
    Event.off(document, 'click', mockFn, {useCapture: false});
    spy.mockRestore()
  })

  it('should fire an event once', function(){
    var mockFn = jest.fn()
    Event.one($el, 'test', mockFn)
    Event.fire($el, 'test')
    Event.fire($el, 'test')

    expect(mockFn.mock.calls.length).toBe(1)
  })
})
