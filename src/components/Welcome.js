import React, {useState} from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";

import ceeo from "../img/ceeo.png";
import { isWindows } from "react-device-detect";


function Welcome(props) {
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

    const ratio = window.innerWidth / 200;

    return (
        <div className={props.className}>
            <h1 className="m-4 text-4xl font-semibold text-center">Welcome to Web PyREPL!</h1>
            <p className="text-center text-lg my-6">Please choose an account type to continue</p>
            <div className="grid grid-cols-2">
                <div className="p-2 m-4">
                    <div className="mb-8">
                        <h3 className="text-xl text-center block">Continue as a Guest user</h3>
                        <p className="block mx-8 my-4">Your code will be saved to your browser, but your code will be deleted if you clear your cache/browser history. You are responsible for maintaining a backup for all of your code.</p>
                    </div>
                    <div className="flex justify-center my-4">
                        <Button variant="contained" onClick={() => handleOpen()}>Continue as Guest</Button>
                    </div>
                </div>
                

                <div className="p-2 m-4">
                    <div className="mb-8">
                        <h3 className="text-xl text-center block">Sign In with Google</h3>
                        <p className="block mx-8 my-4">Code will be saved to your browser and backups will be stored on our servers. You have the option to manually push new code updates to your account that will be saved to the cloud.</p>
                    </div>
                    <div className="flex justify-center my-4">
                        <Button variant="contained">Sign In with Google</Button>
                    </div>
                </div>
            </div>
            <div className="">
                <a className="flex justify-center my-12" href="https://ceeo.tufts.edu/" alt="Tufts CEEO Website">
                    <img 
                        src={ceeo}  
                        alt="Tufts Center for Engineering Education and Outreach" 
                        style={{maxWidth: "35%", height: "auto"}}
                        className=""
                    />
                </a>
                
            </div>
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