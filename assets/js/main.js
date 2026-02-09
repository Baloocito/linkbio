/**
 * TOPINGAMES - JS Ecosistema Único
 * Maneja: Animaciones, Modales, RRSS y GA4 Tracking
 */

document.addEventListener('DOMContentLoaded', () => {
  initGlobalTracking() // RRSS, Tiendas y Compras
  initModalLogic() // Apertura, Cierre y View_item
  initAnimations() // Fade-ins automáticos
})

/**
 * 1. RASTREO GLOBAL Y REDIRECCIONES
 * Captura clics en RRSS, selección de tienda y botones de pago
 */
function initGlobalTracking() {
  document.addEventListener('click', (e) => {
    // --- CLIC EN TIENDAS (Desde Index) ---
    const shopLink = e.target.closest('[data-tienda-link]')
    if (shopLink) {
      trackEvent('select_content', {
        content_type: 'shop_selection',
        item_id: shopLink.dataset.tiendaLink,
      })
      return // Deja que el enlace siga su curso natural
    }

    // --- CLIC EN REDES SOCIALES ---
    const socialLink = e.target.closest('[data-social]')
    if (socialLink) {
      trackEvent('click_social', {
        platform: socialLink.dataset.social,
      })
      return // Deja que abra la red social
    }

    // --- BOTÓN COMPRAR (Dentro de Modales) ---
    const buyBtn = e.target.closest('.comprar-btn')
    if (buyBtn) {
      const { linkPago, producto, tienda } = buyBtn.dataset

      trackEvent('begin_checkout', {
        item_id: producto,
        tienda_origen: tienda,
        url_destino: linkPago,
      })

      // Delay de seguridad para GA4
      setTimeout(() => {
        window.location.href = linkPago
      }, 200)
      e.preventDefault()
    }
  })
}

/**
 * 2. LÓGICA DE MODALES
 * Maneja visualización de productos y abandonos
 */
function initModalLogic() {
  // ABRIR
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
    modal.classList.remove('hidden')
    modal.classList.add('flex')
    document.body.style.overflow = 'hidden'
    if (box) box.classList.add('animate-modalIn')
  })

  // CERRAR
  document.addEventListener('click', (e) => {
    const trigger = e.target.closest('[data-close-modal]')
    if (!trigger) return

    const productoCerrado = trigger.dataset.closeModal
    const tiendaOrigen = trigger.dataset.tienda

    if (productoCerrado) {
      trackEvent('modal_close', {
        item_id: productoCerrado,
        tienda_origen: tiendaOrigen,
      })
    }

    const modal = trigger.closest('.fixed')
    const box = modal?.querySelector('.modal-box')

    if (box) {
      box.style.opacity = '0'
      box.style.transform = 'scale(0.95)'
      box.style.transition = 'all 0.2s ease-in'
    }

    setTimeout(() => {
      if (modal) {
        modal.classList.add('hidden')
        modal.classList.remove('flex')
      }
      if (box) {
        box.classList.remove('animate-modalIn')
        box.style.opacity = ''
        box.style.transform = ''
      }
      document.body.style.overflow = ''
    }, 200)
  })
}

/**
 * 3. ANIMACIONES DE ENTRADA
 * Detecta qué elementos existen en la página actual y los anima
 */
function initAnimations() {
  const elements = [
    { id: 'hero', delay: 0 },
    { id: 'cta', delay: 250 }, // Para el index
    { id: 'products', delay: 250 }, // Para las tiendas
    { id: 'links', delay: 450 }, // Para el index
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

/**
 * HELPER: Enviar a GA4 y Console (para debug)
 */
function trackEvent(name, params) {
  if (window.gtag) {
    gtag('event', name, params)
  }
  // Descomenta la siguiente línea para ver los eventos en la consola del navegador
  // console.log(`[GA4 EVENT]: ${name}`, params);
}
