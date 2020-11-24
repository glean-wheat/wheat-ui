function loadScript(src) {
  return new Promise(function(resolve, reject) {
    const script = document.createElement('script')
    script.src = src
    script.onload = resolve
    script.onerror = reject
    document.head.appendChild(script)
  })
}

// Lazy load the polyfill if necessary.
if (!supportsCustomElementsV1) {
  loadScript('/bower_components/custom-elements/custom-elements.min.js').then(
    e => {
      // Polyfill loaded.
    }
  )
} else {
  // Native support.Good to go.
}
