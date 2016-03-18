var onLoad = []
var onChange = []
var bean = require('bean')

module.exports = {
  ready: ready,
  change: change
}

function load(fn) {
  onLoad.push(fn)
}

function change(fn) {
  onChange.push(fn)
}

bean.on(document, 'DOMContentLoaded', pageLoad)

// Support rails turbolinks page load event
bean.on(document, 'page:change', pageChange)

function pageLoad(){
  onLoad.forEach(function(fn) {
    fn()
  })
  if(!window.Turbolinks) {
    pageChange()
  }
}

function pageChange(){
  onChange.forEach(function(fn) {
    fn()
  })
}
