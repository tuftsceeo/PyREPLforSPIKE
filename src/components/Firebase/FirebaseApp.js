import 'firebase/compat/firestore';
import 'firebase/compat/auth';

import { useAuthState } from 'react-firebase-hooks/auth';
import  { useCollectionData } from 'react-firebase-hooks/firestore'
import { getFirestore, doc, getDoc, setDoc, collection, query, orderBy, limit, Timestamp } from 'firebase/firestore';
import { initializeApp } from '@firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";


const firebaseConfig = {
    apiKey: "AIzaSyBj_GV9lYp0Ky39SpLmeCC8bGVIlKJEmuA",
    authDomain: "pyrepl.firebaseapp.com",
    projectId: "pyrepl",
    storageBucket: "pyrepl.appspot.com",
    messagingSenderId: "379036205185",
    appId: "1:379036205185:web:8008c7e9c8ad29e66c0d80",
    measurementId: "G-WX7BNYZCKV"
};

const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
const auth = getAuth(app);

const provider = new GoogleAuthProvider();
const [user] = useAuthState(auth);