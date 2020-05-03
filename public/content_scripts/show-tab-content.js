if (document.getElementById('web-extension-konomi-sensei-overlay')) {
  const overlay = document.getElementById('web-extension-konomi-sensei-overlay')
  overlay.style.opacity = '0'

  setTimeout(() => {
    overlay.remove()
  }, 500)
}
