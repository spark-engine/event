var Event           = require('@spark-engine/bean')
var callbackManager = require('./callback-manager')

// Create a new page event manager
var manager = {
  ready: callbackManager.new(),
  change: callbackManager.new(),
  beforeVisit: callbackManager.new(),
  beforeChange: callbackManager.new(),
  beforeRender: callbackManager.new(),
  beforeUnload: callbackManager.new(),
  readyAlready: false,
  changed: false,
}

manager.ready.add(function(){
  manager.readyAlready = true
})

manager.ready.add(function(){
  if (!window.Turbolinks && !manager.changed) {
    manager.changed = true
    manager.change.fire()
  }
})

// beforeChange fires for both visits (xhr change) and beforeunload (standard page requests)
manager.beforeUnload.add(manager.beforeChange.fire)

var ready = function (fn) {
  if (manager.readyAlready) { fn() }
  return manager.ready.add(fn) }

var change = function(fn) {
  if (manager.changed) { fn() }
  return manager.change.add(fn) }

var beforeVisit = function(fn) {
  return manager.beforeVisit.add(fn) }

var beforeChange = function(fn) {
  return manager.beforeChange.add(fn) }

var beforeRender = function(fn) {
  return manager.beforeRender.add(fn) }

var beforeUnload = function(fn) {
  return manager.beforeUnload.add(fn) }

// Make it easy to trigger ready callbacks
ready.fire = function () {
  manager.ready.fire()
  // Be sure ready can only be fired once
  manager.ready.stop() }

// Make it easy to trigger change callbacks
change.fire = function (event) {
  manager.change.fire(event.originalEvent || event) }

// Make it easy to trigger beforeVisit callbacks
beforeVisit.fire = function (event) {
  manager.beforeVisit.fire(event.originalEvent || event) }

// Make it easy to trigger beforeChange callbacks
beforeChange.fire = function (event) {
  manager.beforeChange.fire(event.originalEvent || event) }

// Make it easy to trigger beforeRender callbacks
beforeRender.fire = function (event) {
  manager.beforeRender.fire(event.originalEvent || event) }

// Make it easy to trigger beforeUnload callbacks
beforeUnload.fire = function (event) {
  manager.beforeUnload.fire(event.originalEvent || event) }

Event.on(document, 'DOMContentLoaded', ready.fire)
Event.on(document, 'page:change turbolinks:load', change.fire)
Event.on(document, 'page:before-visit turbolinks:before-visit', beforeVisit.fire)
Event.on(document, 'page:request-start turbolinks:request-start', beforeChange.fire)
Event.on(document, 'page:before-render turbolinks:before-render', beforeRender.fire)
Event.on(window, 'beforeunload', beforeUnload.fire)

module.exports = {
  ready: ready,
  change: change,
  beforeVisit: beforeVisit,
  beforeChange: beforeChange,
  beforeRender: beforeRender,
  beforeUnload: beforeUnload
}
