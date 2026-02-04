document.querySelectorAll('.comprar-btn').forEach((button) => {
  button.addEventListener('click', async () => {
    const producto = button.dataset.producto
    const linkPago = button.dataset.linkPago

    // Guardar lead (best effort)
    try {
      await addDoc(collection(db, 'leads'), {
        producto_comprado: producto,
        fecha: serverTimestamp(),
        origen: 'link-bio',
      })
    } catch (error) {
      console.error('No se pudo guardar el lead', error)
    }

    // Redirección inmediata al pago
    window.location.href = linkPago
  })
})
document.addEventListener('DOMContentLoaded', () => {
  const botonesComprar = document.querySelectorAll('.comprar-btn')

  botonesComprar.forEach((boton) => {
    boton.addEventListener('click', () => {
      const linkPago = boton.dataset.linkPago

      if (!linkPago) {
        console.error('No hay link de pago definido')
        return
      }

      // Redirección directa a Mercado Pago
      window.location.href = linkPago
    })
  })
})

document.querySelectorAll('[data-open-modal]').forEach((btn) => {
  btn.addEventListener('click', () => {
    const modalId = btn.getAttribute('data-open-modal')
    const modal = document.getElementById(modalId)
    const box = modal.querySelector('.relative')

    modal.classList.remove('hidden')
    modal.classList.add('flex')

    // fuerza repaint real
    box.getBoundingClientRect()

    box.classList.remove('scale-90', 'opacity-0')
    box.classList.add('scale-100', 'opacity-100')
  })
})

// Cerrar modal
document.querySelectorAll('[data-close-modal]').forEach((el) => {
  el.addEventListener('click', () => {
    const modal = el.closest('.fixed')
    const box = modal.querySelector('.relative')

    box.classList.add('scale-90', 'opacity-0')

    setTimeout(() => {
      modal.classList.add('hidden')
      modal.classList.remove('flex')
    }, 400)
  })
})

document.addEventListener('DOMContentLoaded', () => {
  const hero = document.getElementById('hero')
  const products = document.getElementById('products')
  const logo = hero.querySelector('img')

  // Si el logo ya está cacheado
  if (logo.complete) {
    startAnimations()
  } else {
    logo.addEventListener('load', startAnimations)
  }

  function startAnimations() {
    // HERO
    hero.classList.add('animate-fadeSlideUp')

    // PRODUCTS (delay real, no visual falso)
    setTimeout(() => {
      products.classList.add('animate-fadeSlideUp')
    }, 400)
  }
})
const openButtons = document.querySelectorAll('[data-open-modal]')
const closeButtons = document.querySelectorAll('[data-close-modal]')

openButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    const modal = document.getElementById(btn.dataset.openModal)
    const box = modal.querySelector('.modal-box')

    modal.classList.remove('hidden')

    // Forzar repaint (clave para animación limpia)
    requestAnimationFrame(() => {
      box.classList.add('modal-open')
    })

    document.body.style.overflow = 'hidden'
  })
})

closeButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    const modal = btn.closest('[id^="modal"]')
    const box = modal.querySelector('.modal-box')

    box.classList.remove('modal-open')

    setTimeout(() => {
      modal.classList.add('hidden')
      document.body.style.overflow = ''
    }, 300)
  })
})
