/*
 * FirebaseApp.js
 * By: Gabriel Sessions
 * Last Edit: 8/2/2022
 * 
 * Firebase app services initialization and configuration management 
 * 
 */ 

import 'firebase/compat/firestore';
import 'firebase/compat/auth';

import { useAuthState } from 'react-firebase-hooks/auth';
import { getFirestore } from 'firebase/firestore';
import { initializeApp } from '@firebase/app';
import { getAuth, GoogleAuthProvider, GithubAuthProvider  } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyBj_GV9lYp0Ky39SpLmeCC8bGVIlKJEmuA",
    authDomain: "pyrepl.firebaseapp.com",
    projectId: "pyrepl",
    storageBucket: "pyrepl.appspot.com",
    messagingSenderId: "379036205185",
    appId: "1:379036205185:web:8008c7e9c8ad29e66c0d80",
    measurementId: "G-WX7BNYZCKV"
};

export const app = initializeApp(firebaseConfig);
export const firestore = getFirestore(app);
export const auth = getAuth(app);

export const googleProvider = new GoogleAuthProvider();
export const githubProvider = new GithubAuthProvider();


export function User() {
    const [user] = useAuthState(auth);
    return (user);
}
