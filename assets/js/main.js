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

    if (!linkPago) {
      console.error('No hay link de pago definido')
      return
    }

    // 🔥 REDIRECCIÓN DIRECTA (core del negocio)
    window.location.href = linkPago

    // 🧠 Lead opcional (cuando Firebase esté listo)
    if (typeof saveLead === 'function') {
      try {
        saveLead(btn.dataset.producto)
      } catch (e) {
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

    const modalId = btn.getAttribute('data-open-modal')
    const modal = document.getElementById(modalId)
    if (!modal) return

    const box = modal.querySelector('.modal-box')
    if (!box) return

    modal.classList.remove('hidden')
    modal.classList.add('flex')
    document.body.style.overflow = 'hidden'

    // Forzar repaint para que la animación funcione
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

    // Animación de salida
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
