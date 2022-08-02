/*
 * SignIn.js
 * By: Gabriel Sessions
 * Last Edit: 8/2/2022
 * 
 * Functions that allow users to login with Google or GitHub to the site
 * 
 */ 

import 'firebase/compat/auth';
import { signInWithPopup, GoogleAuthProvider, GithubAuthProvider  } from "firebase/auth";
import { auth,  googleProvider, githubProvider } from "./FirebaseApp";


export const signInWithGoogle = (callback) => {
    signInWithPopup(auth, googleProvider)
    .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        // The signed-in user info.
        const user = result.user;
        callback();
    }).catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        console.error(errorMessage);
    });
};

export const signInWithGitHub = (callback) => {
    signInWithPopup(auth, githubProvider)
    .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GithubAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        // The signed-in user info.
        const user = result.user;
        console.log(user);
        callback();
    }).catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = GithubAuthProvider.credentialFromError(error);
        console.error(errorMessage);
    });
};
    