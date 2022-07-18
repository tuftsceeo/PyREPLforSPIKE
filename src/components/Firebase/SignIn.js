import 'firebase/compat/auth';

import { useAuthState } from 'react-firebase-hooks/auth';
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth, provider, user } from "./FirebaseApp";


function SignIn() {
    const signInWithGoogle = () => {
        signInWithPopup(auth, provider)
        .then((result) => {
            // This gives you a Google Access Token. You can use it to access the Google API.
            const credential = GoogleAuthProvider.credentialFromResult(result);
            const token = credential.accessToken;
            // The signed-in user info.
            const user = result.user;
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
    }
    return (
        <div className=''>
            <h1 className='flex justify-center'>Sign with Google to access the application</h1>
            <br />
            <button className={"rounded border bg-slate-100 flex justify-center text-center p-1 mx-auto"} onClick={signInWithGoogle}>Sign in with Google</button>
        </div>
        
    )
}

export default SignIn;