// Configuración y variables globales
const CONFIG = {
  animationDuration: 400,
  modalTransition: 300,
}

// --- INICIALIZACIÓN PRINCIPAL ---
document.addEventListener('DOMContentLoaded', () => {
  initShoppingLogic()
  initModalLogic()
  initAnimations()
})

// --- LÓGICA DE COMPRA Y LEADS ---
function initShoppingLogic() {
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.comprar-btn')
    if (!btn) return

    const linkPago = btn.dataset.linkPago
    const producto = btn.dataset.producto || 'desconocido'

    if (!linkPago) {
      console.error('No hay link de pago definido')
      return
    }

    // 📊 EVENTO GA4 — intención de compra
    if (window.gtag) {
      gtag('event', 'click_comprar', {
        producto: producto,
        origen: 'modal',
      })
    }

    // 🔥 REDIRECCIÓN DIRECTA
    window.location.href = linkPago

    // 🧠 Lead opcional (cuando Firebase esté listo)
    if (typeof saveLead === 'function') {
      try {
        saveLead(producto)
      } catch {
        console.warn('Lead no guardado (Firebase no activo)')
      }
    }
  })
}

async function saveLead(producto) {
  try {
    await addDoc(collection(db, 'leads'), {
      producto_comprado: producto || 'desconocido',
      fecha: serverTimestamp(),
      origen: 'link-bio',
    })
  } catch (error) {
    console.error('Error al guardar lead:', error)
  }
}

// --- LÓGICA DE MODALES (Unificada) ---
function initModalLogic() {
  // ABRIR MODAL
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-open-modal]')
    if (!btn) return

    const modalId = btn.dataset.openModal
    const producto = btn.dataset.producto || 'desconocido'

    const modal = document.getElementById(modalId)
    if (!modal) return

    const box = modal.querySelector('.modal-box')
    if (!box) return

    // 📊 EVENTO GA4 — interés real (FIXED)
    if (window.gtag) {
      gtag('event', 'open_modal', {
        modal_id: modalId,
        producto: producto,
      })
    }

    modal.classList.remove('hidden')
    modal.classList.add('flex')
    document.body.style.overflow = 'hidden'

    requestAnimationFrame(() => {
      box.classList.remove('opacity-0', 'scale-95')
      box.classList.add('opacity-100', 'scale-100')
    })
  })

  // CERRAR MODAL
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-close-modal]')
    if (!btn) return

    const modal = btn.closest('[id^="modal"]')
    if (!modal) return

    const box = modal.querySelector('.modal-box')
    if (!box) return

    box.classList.remove('opacity-100', 'scale-100')
    box.classList.add('opacity-0', 'scale-95')

    setTimeout(() => {
      modal.classList.add('hidden')
      modal.classList.remove('flex')
      document.body.style.overflow = ''
    }, CONFIG.animationDuration)
  })
}

// --- ANIMACIONES DE CARGA (Hero & Logo) ---
function initAnimations() {
  const hero = document.getElementById('hero')
  const products = document.getElementById('products')
  if (!hero) return

  const logo = hero.querySelector('img')

  const start = () => {
    hero.classList.add('animate-fadeSlideUp')
    setTimeout(() => {
      if (products) products.classList.add('animate-fadeSlideUp')
    }, CONFIG.animationDuration)
  }

  if (logo && logo.complete) {
    start()
  } else if (logo) {
    logo.addEventListener('load', start)
  } else {
    start() // Por si no hay logo
  }
}
