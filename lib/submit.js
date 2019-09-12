// Manually trigger a cancelable form submit event.
function submit(form) {
  if (!form.tagName || form.tagName != 'FORM') {
    return console.error('Trigger this event on a form element')
  }

  var ev = new CustomEvent('submit', { bubbles: true, cancelable: true, detail: { triggered: true } })
  form.dispatchEvent(ev)

  // Submit form unless event default is prevented
  if (!ev.defaultPrevented) form.submit()
}

module.exports = submit
