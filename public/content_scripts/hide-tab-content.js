if (!document.getElementById('web-extension-konomi-sensei-overlay')) {
  const overlay = document.createElement('div')

  overlay.setAttribute('id', 'web-extension-konomi-sensei-overlay')
  overlay.style.width = '100%'
  overlay.style.height = '100%'
  overlay.style.backgroundColor = '#ffffff'
  overlay.style.position = 'fixed'
  overlay.style.display = 'flex'
  overlay.style.top = 0
  overlay.style.left = 0
  overlay.style.zIndex = 2147483647
  overlay.style.transitionProperty = 'opacity'
  overlay.style.transitionDuration = '0.5s'
  overlay.style.opacity = '0'

  chrome.storage.local.get('image', function(items) {
    if (items.image) {
      const img = document.createElement('img')

      img.src = items.image
      img.style.maxWidth = '100%'
      img.style.maxHeight = '100%'

      overlay.style.justifyContent = 'flex-end'
      overlay.style.alignItems = 'flex-end'
      overlay.appendChild(img)
    } else {
      const message = document.createElement('div')
      message.textContent = "This page can't be viewed."
      message.style.color = '#000'
      message.style.fontSize = '2vw'

      overlay.style.justifyContent = 'center'
      overlay.style.alignItems = 'center'
      overlay.appendChild(message)
    }

    document.body.appendChild(overlay)
    setTimeout(() => {
      overlay.style.opacity = '1'
    }, 100)
  })
}
