var Manager = {
  new: function() {

    var manager = {

      callbacks: { },

      fire: function( ) {

        var args = Array.prototype.slice.call(arguments)
        if ( args.length < 1 ) { args = Object.keys( manager.callbacks ) }

        args.forEach( function( type ) {
          manager.callbacks[type].forEach( function( callback ) { callback.fire() } )
        })
      },

      add: function( fn, type ) {
        type = type || 'default'
        if ( !manager.callbacks[type] ) { manager.callbacks[type] = [] }

        var cb = {
          fire:     function() { if ( cb.enabled ) { fn() } },
          stop:     function() { cb.enabled = false },
          start:    function() { cb.enabled = true },
          enabled:  true
        }

        manager.callbacks[type].push( cb )
        return cb
      },
      
      removeAll: function( type ) {
        if (type) {
          manager.callbacks[type] = []
        } else {
          manager.callbacks = {}
        }
      }
    }

    return manager
  }
}

module.exports = Manager
