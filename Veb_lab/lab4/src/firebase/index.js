import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyD5YSvOVi_YV7IBvO--2g-FvVxIPhYd_Kw",
    authDomain: "web-labu.firebaseapp.com",
    projectId: "web-labu",
    storageBucket: "web-labu.firebasestorage.app",
    messagingSenderId: "118043742531",
    appId: "1:118043742531:web:cfbc844c46b5f43ec55ff6",
    measurementId: "G-JQHPTP8VCG"
  };

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);