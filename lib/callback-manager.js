var Manager = {
  new: function() {

    var manager = {

      callbacks: { all: [] },

      fire: function( type ) {
        type = type || 'default'
        manager.callbacks[type].forEach( function( callback ) { callback.fire() } )
      },

      pause: function( callback ) {
        callback.paused = true
      },

      resumed: function( callback ) {
        callback.paused = false
      },

      add: function( fn, type ) {
        type = type || 'default'
        if ( !manager.callbacks[type] ) { manager.callbacks[type] = [] }

        var cb = {
          fire:     function() { if ( !cb.paused ) { fn() } },
          stop:     function() { cb.paused = true },
          pause:    function() { cb.paused = true },
          resume:   function() { cb.paused = false },
          paused:   false
        }

        manager.callbacks[type].push( cb )
        return cb
      },
    }

    return manager
  }
}

module.exports = Manager
