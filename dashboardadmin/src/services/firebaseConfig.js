import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"; 
import { getFirestore } from "firebase/firestore"; 
import { getDatabase } from "firebase/database";
import { ref, get, set, push, update, onValue, remove } from "firebase/database";


const firebaseConfig = {
    apiKey: "",
    authDomain: "",
    databaseURL: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: "",
    appId: "",
    measurementId: ""
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);
const db = getDatabase(app);
const DB = getFirestore(app);

export { auth, firestore, db, ref, get, set, push, update, onValue, remove, DB};
