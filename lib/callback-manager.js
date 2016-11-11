var Manager = {
  new: function() {
    var manager = {

      callbacks: [],

      add: function( fn ) {

        var cb = Manager.callback.new( fn )
        manager.callbacks.push( cb )
        
        return cb

      },

      stop: function() {
        manager.callbacks.forEach( function( cb ) { cb.stop() } )
      },

      start: function() {
        manager.callbacks.forEach( function( cb ) { cb.start() } )
      },

      toggle: function( bool ) {
        manager.callbacks.forEach( function( cb ) { cb.toggle( bool ) } )
      },

      remove: function() {
        manager.callbacks = []
      },

      fire: function() {
        var args = Array.prototype.slice.call( arguments )
        manager.callbacks.forEach( function( fn ) { fn.apply( this, args ) } )
      }
    }

    return manager
  },

  callback: {
    new: function( fn ) {
      var cb = function() {
        if ( cb.enabled ) { fn.apply( fn, arguments ) }
      }

      cb.stop   = function() { cb.enabled = false }
      cb.start  = function() { cb.enabled = true }
      cb.toggle = function( bool ) {
        cb.enabled = ( 0 in arguments ) ? bool : !cb.enabled
      }
      cb.enabled = true

      return cb
    }
  }
}

module.exports = Manager
