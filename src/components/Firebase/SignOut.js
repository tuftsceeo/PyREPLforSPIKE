/*
 * SignOut.js
 * By: Gabriel Sessions
 * Last Edit: 8/2/2022
 * 
 * If a user is signed into the site, the SignOut function signs the user out
 * 
 */ 

import { auth } from "./FirebaseApp";

function SignOut() {
    return auth.currentUser && (
        <button 
        className="block px-4 py-2 text-sm text-gray-700"
        role="menuitem" 
        tabIndex="-1" 
        id="user-menu-item-2"
        onClick={() => {
            auth.signOut()
            
        }}>
            Sign Out
        </button>
    )
}

export default SignOut;