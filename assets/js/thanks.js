import { db } from './firebase.js'
import { addDoc, collection, serverTimestamp } from 'firebase/firestore'

// 1. Configuración de productos (Fácil de mantener)
const KITS_CONFIG = {
  pro: {
    nombre: 'Kit Influencer Pro',
    valor: 29000,
    titulo: '¡Gracias por comprar el Kit Pro! 🚀',
    mensaje: 'Tu pago fue confirmado. Coordina ahora el envío por WhatsApp.',
  },
  basico: {
    nombre: 'Kit Influencer Básico',
    valor: 19000,
    titulo: '¡Gracias por tu compra! 🎮',
    mensaje: 'Tu pago fue confirmado. Escríbenos para coordinar el envío.',
  },
  default: {
    nombre: 'Producto desconocido',
    valor: 0,
    titulo: '¡Gracias por tu compra!',
    mensaje: 'Tu pago fue confirmado. Escríbenos para coordinar el envío.',
  },
}

document.addEventListener('DOMContentLoaded', async () => {
  // 2. Captura de parámetros
  const params = new URLSearchParams(window.location.search)
  const kitKey = params.get('kit') || 'default'
  const config = KITS_CONFIG[kitKey] || KITS_CONFIG['default']

  // 3. Referencias al DOM
  const ui = {
    title: document.getElementById('thanks-title'),
    message: document.getElementById('thanks-message'),
    whatsapp: document.getElementById('whatsapp-link'),
  }

  // 4. Actualizar UI
  if (ui.title) ui.title.innerText = config.titulo
  if (ui.message) ui.message.innerText = config.mensaje

  // 5. Registro en Firebase y Google Analytics
  try {
    const pedidoRef = await crearPedido({
      producto: config.nombre,
      kit: kitKey,
      precio: config.valor,
    })

    const orderId = pedidoRef.id

    // Registrar Evento GA4
    if (window.gtag) {
      gtag('event', 'pago_confirmado', {
        item_id: orderId,
        producto: config.nombre,
        value: config.valor,
        currency: 'CLP',
        method: 'mercadopago',
      })
    }

    // 6. Preparar WhatsApp
    prepararWhatsApp(ui.whatsapp, orderId, config.nombre)
  } catch (error) {
    console.error('Error en el proceso de post-venta:', error)
  }
})

// --- FUNCIONES DE SOPORTE ---

async function crearPedido({ producto, kit, precio }) {
  return await addDoc(collection(db, 'orders'), {
    producto,
    kit,
    precio,
    moneda: 'CLP',
    estado: 'pagado',
    canal: 'mercadopago',
    createdAt: serverTimestamp(),
    metadata: {
      userAgent: navigator.userAgent,
      referrer: document.referrer,
    },
  })
}

function prepararWhatsApp(element, orderId, producto) {
  if (!element) return

  const texto = `
Hola, acabo de realizar una compra.

🧾 Pedido: ${orderId}
📦 Producto: ${producto}

Quiero coordinar el envío.`.trim()

  const whatsappUrl = `https://wa.me/569XXXXXXXX?text=${encodeURIComponent(texto)}`

  element.href = whatsappUrl

  // Auto-redirección UX-friendly (5 segundos)
  setTimeout(() => {
    window.location.href = whatsappUrl
  }, 5000)
}
