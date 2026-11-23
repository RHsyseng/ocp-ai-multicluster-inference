/*
 * Lightweight, dependency-free click-to-zoom lightbox for documentation images.
 * Clicking any block/inline image in the article opens it enlarged in an
 * overlay. Click anywhere (or press Escape) to close. Self-contained so it
 * works in disconnected environments.
 */
;(function () {
  'use strict'

  var IMAGE_SELECTOR = '.doc .imageblock img, .doc .image img'

  function injectStyles () {
    if (document.getElementById('img-zoom-styles')) return
    var css = [
      '.doc .imageblock img, .doc .image img { cursor: zoom-in; }',
      '.img-zoom-overlay {',
      '  position: fixed; inset: 0; z-index: 2000;',
      '  display: none; align-items: center; justify-content: center;',
      '  background: rgba(0, 0, 0, 0.85); cursor: zoom-out;',
      '  opacity: 0; transition: opacity 0.15s ease;',
      '}',
      '.img-zoom-overlay.is-open { opacity: 1; }',
      '.img-zoom-overlay img {',
      '  max-width: 95vw; max-height: 95vh; cursor: zoom-out;',
      '  background: #fff; box-shadow: 0 6px 24px rgba(0, 0, 0, 0.4);',
      '}',
      '.img-zoom-close {',
      '  position: fixed; top: 12px; right: 24px; color: #fff;',
      '  font-size: 40px; line-height: 1; font-weight: bold;',
      '  cursor: pointer; user-select: none;',
      '}'
    ].join('\n')
    var style = document.createElement('style')
    style.id = 'img-zoom-styles'
    style.textContent = css
    document.head.appendChild(style)
  }

  function buildOverlay () {
    var overlay = document.createElement('div')
    overlay.className = 'img-zoom-overlay'
    overlay.setAttribute('role', 'dialog')
    overlay.setAttribute('aria-modal', 'true')

    var close = document.createElement('span')
    close.className = 'img-zoom-close'
    close.setAttribute('aria-label', 'Close')
    close.textContent = '\u00d7'

    var img = document.createElement('img')

    overlay.appendChild(close)
    overlay.appendChild(img)
    document.body.appendChild(overlay)
    return { overlay: overlay, img: img }
  }

  document.addEventListener('DOMContentLoaded', function () {
    var images = document.querySelectorAll(IMAGE_SELECTOR)
    if (!images.length) return

    injectStyles()
    var ui = buildOverlay()

    function open (src, alt) {
      ui.img.setAttribute('src', src)
      ui.img.setAttribute('alt', alt || '')
      ui.overlay.style.display = 'flex'
      void ui.overlay.offsetWidth // force reflow so the transition runs
      ui.overlay.classList.add('is-open')
    }

    function hide () {
      ui.overlay.classList.remove('is-open')
      ui.overlay.style.display = 'none'
      ui.img.removeAttribute('src')
    }

    Array.prototype.forEach.call(images, function (image) {
      image.addEventListener('click', function () {
        open(image.currentSrc || image.src, image.alt)
      })
    })

    ui.overlay.addEventListener('click', hide)
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && ui.overlay.classList.contains('is-open')) hide()
    })
  })
})()
