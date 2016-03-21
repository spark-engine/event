var onReady = []
var onChange = []
var bean = require('bean')
var readyAlready = false

module.exports = {
  ready: ready,
  change: change
}

function ready(fn) {
  if (readyAlready)
    fn()
  else
    onReady.push(fn)
}

function change(fn) {
  onChange.push(fn)
}

function pageReady(){
  onReady.forEach(function(fn) { fn() })

  if (!window.Turbolinks) {
    pageChange()
  }
}

function pageChange(){
  onChange.forEach(function(fn) { fn() })
}

bean.on(document, 'DOMContentLoaded', pageReady)
// Support rails turbolinks page load event
bean.on(document, 'page:change', pageChange)
