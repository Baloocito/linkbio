const CONFIG = {
  animationDuration: 350, // Coincide con modalIn 0.35s
  leadSource:
    window.location.pathname.includes('vape') ||
    window.location.pathname.includes('bateria')
      ? 'tienda-vape'
      : 'tienda-kits',
}

document.addEventListener('DOMContentLoaded', () => {
  initShoppingLogic()
  initModalLogic()
  initAnimations()
})

function initShoppingLogic() {
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.comprar-btn')
    if (!btn) return

    const { linkPago, producto } = btn.dataset

    if (window.gtag) {
      gtag('event', 'click_comprar', {
        item_id: producto,
        tienda: CONFIG.leadSource,
        url_pago: linkPago,
      })
    }

    // Redirección con leve delay para GA4
    setTimeout(() => {
      window.location.href = linkPago
    }, 150)
  })
}

function initModalLogic() {
  // Abrir Modal
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-open-modal]')
    if (!btn) return

    const modalId = btn.dataset.openModal
    const modal = document.getElementById(modalId)
    if (!modal) return

    const box = modal.querySelector('.modal-box')
    modal.classList.remove('hidden')
    modal.classList.add('flex')
    document.body.style.overflow = 'hidden'

    // Aplicamos la animación definida en tu Tailwind Config
    box.classList.add('animate-modalIn')
  })

  // Cerrar Modal
  document.addEventListener('click', (e) => {
    const isCloseTrigger = e.target.closest('[data-close-modal]')
    if (!isCloseTrigger) return

    const modal = isCloseTrigger.closest('.fixed')
    const box = modal?.querySelector('.modal-box')

    if (box) {
      // Revertimos la animación (fade out rápido)
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

function initAnimations() {
  const hero = document.getElementById('hero')
  const products = document.getElementById('products')

  if (hero) {
    hero.classList.add('animate-fadeSlideUp')
    // Los productos aparecen justo después
    setTimeout(() => {
      if (products) products.classList.add('animate-fadeSlideUp')
    }, 250)
  }
}
