// This simplifies common uses for window.matchMedia 
// namely, adding listeners for width and height queries

function parseQuery( query, dimension ) {
  var result = {}

  if ( typeof( query ) === 'string' ) { return query }

  result.min = size( query.min, 'min-' + dimension )
  result.max = size( query.max, 'max-' + dimension )

  if ( result.min && result.max )
    result.query = result.min + ' and ' + result.max

  return result.query || result.min || result.max
},

function size( num, limit ) {
  return ( num ) ? '('+limit+': ' + toPx( num ) + ')' : null
}

function toPx( width ) {
  if ( typeof( width ) === 'number' ) { return width + 'px'}
  return width
}

var media = {

  width: function( query, fn ) {
    return media.listen( media.parseQuery( query, 'width' ), fn )
  },

  height: function( query, fn ) {
    return media.listen( media.parseQuery( query, 'height' ), fn )
  },

  minWidth: function( size, fn ) {
    return media.width( { min: size }, fn )
  },

  maxWidth: function( size, fn ) {
    return media.width( { max: size }, fn )
  },

  minHeight: function( size, fn ) {
    return media.height( { min: size }, fn )
  },

  maxHeight: function( size, fn ) {
    return media.height( { max: size }, fn )
  },

  listen: function( query, fn ) {
    var match = window.matchMedia( query )

    if ( fn ) {
      fn( match )
      match.addListener( fn )
    }

    return match
  }

}


module.exports = media
