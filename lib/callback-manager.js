var Manager = {
  new: function() {

    var manager = {

      callbacks: { },

      fire: function( type ) {
        type = type || 'default'
        manager.callbacks[type].forEach( function( callback ) { callback.fire() } )
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
    }

    return manager
  }
}

module.exports = Manager
