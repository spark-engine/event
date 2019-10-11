var Event = require("../")
var manager = Event.callbackManager.new()

describe("callback-manager", function(){
  beforeEach(function() {
    manager.remove()
  })

  it("pauses and resumes callbacks", function(){
    var mockFn = jest.fn()
    var cb = Event.callback.new( mockFn )
    cb()
    expect(mockFn.mock.calls.length).toBe(1)

    cb.stop()
    cb()
    expect(cb.enabled).toBe(false)
    expect(mockFn.mock.calls.length).toBe(1)

    cb.start()
    cb()
    expect(cb.enabled).toBe(true)
    expect(mockFn.mock.calls.length).toBe(2)

    cb.toggle()
    cb()
    expect(cb.enabled).toBe(false)
    expect(mockFn.mock.calls.length).toBe(2)

    cb.toggle()
    cb()
    expect(cb.enabled).toBe(true)
    expect(mockFn.mock.calls.length).toBe(3)

    cb.toggle(true)
    cb()
    expect(cb.enabled).toBe(true)
    expect(mockFn.mock.calls.length).toBe(4)

    cb.toggle(false)
    cb()
    expect(cb.enabled).toBe(false)
    expect(mockFn.mock.calls.length).toBe(4)
  })

  it("fires manager callbacks", function(){
    var mockFn = jest.fn()
    manager.add( mockFn )
    manager.fire()
    expect(mockFn.mock.calls.length).toBe(1)

    manager.fire()
    expect(mockFn.mock.calls.length).toBe(2)
  })

  it("stops and starts a manager's callback", function(){
    var mockFn = jest.fn()
    var cb = manager.add( mockFn )
    manager.fire()
    expect(mockFn.mock.calls.length).toBe(1)

    cb.stop()
    manager.fire() // Should be innefective

    expect(mockFn.mock.calls.length).toBe(1)

    cb.start()
    manager.fire()
    expect(mockFn.mock.calls.length).toBe(2)

    cb.toggle()
    manager.fire() // Should be innefective
    expect(mockFn.mock.calls.length).toBe(2)
  })

  it("fires manager callbacks with arguments", function(){
    var mockFn = jest.fn()
    manager.add( mockFn )

    // Test the arguments passed to the Mock function
    manager.fire("a", "b")
    expect(mockFn.mock.calls[0][0]).toBe("a")
    expect(mockFn.mock.calls[0][1]).toBe("b")
  })
})
