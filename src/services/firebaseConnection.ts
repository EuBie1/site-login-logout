

import { initializeApp } from "firebase/app";
import {getFirestore} from 'firebase/firestore'
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAhxp6zOhUc-xWhH7OCMZ7HTEEkNMbB5jk",
  authDomain: "reactlinks-7377a.firebaseapp.com",
  projectId: "reactlinks-7377a",
  storageBucket: "reactlinks-7377a.firebasestorage.app",
  messagingSenderId: "347733440490",
  appId: "1:347733440490:web:b3cfbc825c9cd7eff7e493"
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
const db = getFirestore(app);
export { auth, db }; 