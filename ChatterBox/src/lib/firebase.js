import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth"
import {getFirestore} from "firebase/firestore"
import {getStorage} from "firebase/storage"

const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: "reactchat-5b6ee.firebaseapp.com",
  projectId: "reactchat-5b6ee",
  storageBucket: "reactchat-5b6ee.appspot.com",
  messagingSenderId: "1083745673345",
  appId: "1:1083745673345:web:f233ff935fbb25ef266d80"
};

const app = initializeApp(firebaseConfig);


export const auth = getAuth()
export const db = getFirestore()
export const storage = getStorage()