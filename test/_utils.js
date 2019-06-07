// Utlitiy function for easily appending to HTML
function injectHTML(html, parent) {
  parent = parent || document.body
  parent.insertAdjacentHTML('beforeend', html)
  return parent.lastChild
}

module.exports = {
  injectHTML: injectHTML
}

