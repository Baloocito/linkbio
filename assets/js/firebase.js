import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: 'AIzaSyC1GHHdyCf2Al0kfmn271-jKfAB13EpFeA',
  authDomain: 'tiendatopin-63e4a.firebaseapp.com',
  projectId: 'tiendatopin-63e4a',
  storageBucket: 'tiendatopin-63e4a.firebasestorage.app',
  messagingSenderId: '712075675834',
  appId: '1:712075675834:web:a1c853560299c00a271a83',
  measurementId: 'G-LK85W29P3F',
}

const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
