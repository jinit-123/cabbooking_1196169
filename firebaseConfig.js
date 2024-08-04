// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDfMRDFrAgSnaV_PHNhfO0ZhMyZhnbM_5Y",
    authDomain: "info-6132-d5349.firebaseapp.com",
    projectId: "info-6132-d5349",
    storageBucket: "info-6132-d5349.appspot.com",
    messagingSenderId: "384347165024",
    appId: "1:384347165024:web:ecbe840d7dab6904618e05"
  };

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
