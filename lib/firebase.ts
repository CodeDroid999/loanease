import { initializeApp, getApps, getApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: "AIzaSyA7Ysw1hGBWJzewnzYiJ4tpOoiXNXB1lSk",
  authDomain: "jkservices254.firebaseapp.com",
  databaseURL: "https://jkservices254-default-rtdb.firebaseio.com",
  projectId: "jkservices254",
  storageBucket: "jkservices254.appspot.com",
  messagingSenderId: "1047854753784",
  appId: "1:1047854753784:web:b7ea43c45b07e7439dd80d",
  measurementId: "G-8V0YZNVMHK"
}

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig)
const db = getFirestore(app)
const auth = getAuth(app)

export { app, db, auth }

