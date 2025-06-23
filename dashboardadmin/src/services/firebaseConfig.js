import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"; 
import { getFirestore } from "firebase/firestore"; 
import { getDatabase } from "firebase/database";
import { ref, get, set, push, update, onValue, remove } from "firebase/database";


const firebaseConfig = {
    apiKey: "AIzaSyD9HyHGQdqVJaW0m3l_dU5Bg96ihkXuAMY",
    authDomain: "smart-entreprise-27be8.firebaseapp.com",
    databaseURL: "https://smart-entreprise-27be8-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "smart-entreprise-27be8",
    storageBucket: "smart-entreprise-27be8.firebasestorage.app",
    messagingSenderId: "60772440578",
    appId: "1:60772440578:web:edefec3bd4b031f834a51b",
    measurementId: "G-6YWP9ED20G"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);
const db = getDatabase(app);
const DB = getFirestore(app);

export { auth, firestore, db, ref, get, set, push, update, onValue, remove, DB};
