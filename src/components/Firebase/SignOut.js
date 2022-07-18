import { auth } from "./FirebaseApp";

function SignOut(props) {
    return auth.currentUser && (
        <button 
        className="block px-4 py-2 text-sm text-gray-700"
        role="menuitem" 
        tabIndex="-1" 
        id="user-menu-item-2"
        onClick={() => {
            auth.signOut()
            
        }}>Sign Out</button>
    )
}

export default SignOut;