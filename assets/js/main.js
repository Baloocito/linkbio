/**
 * TOPINGAMES - JS Ecosistema Único
 * Maneja: Animaciones, Modales, RRSS y GA4 Tracking (Limpio de Red Flags)
 */

document.addEventListener('DOMContentLoaded', () => {
  initGlobalTracking()
  initModalLogic()
  initAnimations()
  initAgeGate()
})
function initAgeGate() {
  const ageGate = document.getElementById('age-gate')
  const btnYes = document.getElementById('btn-age-yes')
  const btnNo = document.getElementById('btn-age-no')

  // Usamos 'drpipa_verified' para no mezclar con otros sitios de TopinGames
  if (localStorage.getItem('drpipa_verified') === 'true') {
    if (ageGate) ageGate.style.display = 'none'
    return
  }

  btnYes?.addEventListener('click', () => {
    localStorage.setItem('drpipa_verified', 'true')

    // Animación de salida suave
    if (ageGate) {
      ageGate.style.opacity = '0'
      ageGate.style.transition = 'opacity 0.5s ease'
      setTimeout(() => {
        ageGate.style.display = 'none'
      }, 500)
    }

    trackEvent('age_verification_drpipa', { result: 'allowed' })
  })

  btnNo?.addEventListener('click', () => {
    trackEvent('age_verification_drpipa', { result: 'denied' })
    window.location.href = 'https://www.google.cl'
  })
}
function initGlobalTracking() {
  document.addEventListener('click', (e) => {
    // --- CLIC EN TIENDAS ---
    const shopLink = e.target.closest('[data-tienda-link]')
    if (shopLink) {
      trackEvent('select_content', {
        content_type: 'shop_selection',
        item_id: shopLink.dataset.tiendaLink,
      })
      return
    }

    // --- CLIC EN REDES SOCIALES ---
    const socialLink = e.target.closest('[data-social]')
    if (socialLink) {
      trackEvent('click_social', {
        platform: socialLink.dataset.social,
      })
      return
    }

    // --- BOTÓN COMPRAR ---
    const buyBtn = e.target.closest('.comprar-btn')
    if (buyBtn) {
      const { linkPago, producto, tienda } = buyBtn.dataset

      trackEvent('begin_checkout', {
        item_id: producto,
        tienda_origen: tienda,
        // No enviamos la URL completa para evitar que procesadores de pago
        // vean parámetros extraños en el tracking
        metodo: 'direct_checkout',
      })

      setTimeout(() => {
        window.location.href = linkPago
      }, 200)
      e.preventDefault()
    }
  })
}

function initModalLogic() {
  // ABRIR MODAL
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-open-modal]')
    if (!btn) return

    const { openModal, producto, tienda } = btn.dataset

    trackEvent('view_item', {
      item_id: producto,
      tienda_origen: tienda,
    })

    const modal = document.getElementById(openModal)
    if (!modal) return

    const box = modal.querySelector('.modal-box')
    modal.classList.replace('hidden', 'flex')
    document.body.style.overflow = 'hidden'
    if (box) box.classList.add('animate-modalIn')
  })

  // CERRAR MODAL
  document.addEventListener('click', (e) => {
    const trigger = e.target.closest('[data-close-modal]')
    if (!trigger) return

    // Capturamos el ID del producto que se está cerrando para medir "Abandono de Producto"
    const productoCerrado = trigger.dataset.closeModal

    if (productoCerrado && productoCerrado !== '') {
      trackEvent('modal_close', {
        item_id: productoCerrado,
      })
    }

    const modal = trigger.closest('.fixed')
    const box = modal?.querySelector('.modal-box')

    if (box) {
      box.style.opacity = '0'
      box.style.transform = 'scale(0.95)'
      box.style.transition = 'all 0.15s ease-in'
    }

    setTimeout(() => {
      if (modal) {
        modal.classList.replace('flex', 'hidden')
      }
      if (box) {
        box.classList.remove('animate-modalIn')
        box.style.opacity = ''
        box.style.transform = ''
      }
      document.body.style.overflow = ''
    }, 150)
  })
}

function initAnimations() {
  const elements = [
    { id: 'hero', delay: 0 },
    { id: 'products', delay: 200 },
    { id: 'cta', delay: 300 },
  ]

  elements.forEach((el) => {
    const target = document.getElementById(el.id)
    if (target) {
      setTimeout(() => {
        target.classList.replace('opacity-0', 'animate-fadeSlideUp')
      }, el.delay)
    }
  })
}

function trackEvent(name, params) {
  if (window.gtag) {
    gtag('event', name, params)
  }
  // console.log(`[GA4]: ${name}`, params); // Activar solo en local para pruebas
}
