var cssAnimEventTypes = getAnimationEventTypes()
var supported = cssAnimEventTypes.startanimation !== undefined

module.exports = {
  transform: transformAnimationEvents
}

function camelCaseEventTypes(prefix) {
  prefix = prefix || '';

  return {
    animationstart: prefix + 'AnimationStart',
    animationend: prefix + 'AnimationEnd',
    animationiteration: prefix + 'AnimationIteration'
  };
}

function lowerCaseEventTypes(prefix) {
  prefix = prefix || '';

  return {
    animationstart: prefix + 'animationstart',
    animationend: prefix + 'animationend',
    animationiteration: prefix + 'animationiteration'
  };
}

/**
 * @return {Object} Animation event types {animationstart, animationend, animationiteration}
 */

function getAnimationEventTypes() {
  var prefixes = ['webkit', 'Moz', 'O', ''];
  var style = document.documentElement.style;

  // browser compliant
  if (undefined !== style.animationName) {
    return lowerCaseEventTypes();
  }

  for (var i = 0, len = prefixes.length, prefix; i < len; i++) {
    prefix = prefixes[i];

    if (undefined !== style[prefix + 'AnimationName']) {
      // Webkit
      if (0 === i) {
        return camelCaseEventTypes(prefix.toLowerCase());
      }
      // Mozilla
      else if (1 === i) {
        return lowerCaseEventTypes();
      }
      // Opera
      else if (2 === i) {
        return lowerCaseEventTypes(prefix.toLowerCase());
      }
    }
  }

  return {};
}


// Adds necessary add vendor prefixes or camelCased event names
//
function transformAnimationEvents (events, fn) {
  eventTypes = []
  
  events.split(' ').forEach(function(e){
    if (e.match(/animation/i)) {

      if(!supported) { 

        if(window.env != 'test') {
          console.error('Animation events are not supported')
        }

        // If animation events aren't supported trigger immediately
        fn()

      } else if (cssAnimEventTypes[e]) {
        
        // Fetch properly prefixed, cased event names from Animation Events lib
        eventTypes.push(cssAnimEventTypes[e])

      } else {
        console.error('"' + e + '" is not a supported animation event')
      }
    } else {
      eventTypes.push(e)
    }
  })

  return eventTypes.join(' ')
  
}
