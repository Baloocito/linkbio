import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js'
import { getFirestore } from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js'

const firebaseConfig = {
  apiKey: 'TU_API_KEY',
  authDomain: 'TU_PROYECTO.firebaseapp.com',
  projectId: 'TU_PROYECTO',
}

export const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
