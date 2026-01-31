import { db } from './firebase.js'
import {
  collection,
  addDoc,
  serverTimestamp,
} from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js'

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
