/*
 * Welcome.js
 * By: Gabriel Sessions
 * Last Edit: 8/2/2022
 * 
 * Welcome page for first time site visitors
 * 
 */ 

// UI imports
import React, {useState} from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";

// Firebase imports
import { signInWithGoogle, signInWithGitHub } from "./Firebase/SignIn";


function Welcome(props) {
    // State mangement to display a warning to those using the site as a guest
    const [guestWarning, setGuestWarning] = useState(false);

    function handleOpen() {
        setGuestWarning(true);
    }

    function handleClose(accepted) {
        setGuestWarning(false);
        if (accepted) {
            props.welcomed()
        }
    }

    return (
        <div className={props.className}>
            <h1 className="m-4 text-4xl font-semibold text-center">Welcome to Web PyREPL!</h1>
            <p className="text-center text-lg my-6">Please choose an account type to continue</p>
            <div className="grid grid-cols-2">
                
                {/* Guest Login */}
                <div className="p-2 m-4">
                    <div className="mb-8">
                        <h3 className="text-xl text-center block">Continue as a Guest user</h3>
                        <p className="block mx-8 my-4">Your code will be saved to your browser, but your code will be deleted if you clear your cache/browser history. You are responsible for maintaining a backup for all of your code.</p>
                    </div>
                    <div className="flex justify-center my-4">
                        <Button variant="contained" onClick={() => handleOpen()}>Continue as Guest</Button>
                    </div>
                </div>
                
                {/* Google/GitHub Login */}
                <div className="p-2 m-4">
                    <div className="mb-8">
                        <h3 className="text-xl text-center block">Sign In with Google or GitHub</h3>
                        <p className="block mx-8 my-4">Code will be saved to your browser and backups will be stored on our servers. You have the option to manually push new code updates to your account that will be saved to the cloud.</p>
                    </div>
                    <div className="flex justify-center -my-4">
                        <div className="inline-block mx-4">
                            <div className="flex justify-center my-4">
                                <Button 
                                    variant="contained"
                                    onClick={() => signInWithGoogle(() => handleClose(true))}
                                >Sign In with Google</Button>
                            </div>
                        </div>
                        <div className="inline-block mx-4">
                            <div className="flex justify-center my-4">
                                <Button 
                                    variant="contained"
                                    onClick={() => signInWithGitHub(() => handleClose(true))}
                                >Sign In with GitHub</Button>
                            </div>
                        </div>
                    </div>
                    
                    
                </div>
            </div>
            
            {/* Code backups warning */}
            <Dialog
                open={guestWarning}
                onClose={() => handleClose(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                {"Warning About Code Backups"}
                </DialogTitle>
                <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    By continuing as a Guest user, I understand that Web PyREPL will not save backups for me. My code will be deleted when my browser's cache/history is cleared.
                </DialogContentText>
                </DialogContent>
                <DialogActions>
                <Button onClick={() => handleClose(false)}>Go Back</Button>
                <Button onClick={() => handleClose(true)} autoFocus>
                    Continue
                </Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}

export default Welcome;