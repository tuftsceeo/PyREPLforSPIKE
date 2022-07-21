import React, {useState} from "react";
import { FILE_PREFIX, FILE_SUFFIX } from "../App";

import DeleteButton from "./DeleteButton";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Snackbar from "@mui/material/Snackbar";


function DeleteTextPopup(props) {
    const [open, setOpen] = useState(false);
    const [snackOpen, setSnackOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");

    const MAIN_FILE = FILE_PREFIX + "Main" + FILE_SUFFIX


    function handleOpen() {
        setOpen(true);
    }

    function handleClose(confirmed) {
        setOpen(false);
        if (confirmed) {
            openSnack('REPL Deleted Successfully');
            props.deleteREPL(props.fileName)
        }
        else {
            openSnack("REPL deletion was cancelled");
        }
        
    }

    function openSnack(snackText) {
        setSnackbarMessage(snackText)
        setSnackOpen(true);
    }

    function closeSnack() {
        setSnackOpen(false);
    }

    return (
        <div>
            <div className={props.fileName === MAIN_FILE ? "hidden" : ""}>
                <DeleteButton onClick={() => handleOpen()} />
                <Dialog open={open} onClose={handleClose}>
                    <DialogTitle>{props.formTitle}</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            {props.formBody}
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => handleClose(false)}>Cancel</Button>
                        <Button onClick={() => handleClose(true)}>Delete REPL</Button>
                    </DialogActions>
                </Dialog>

                <Snackbar
                    open={snackOpen}
                    autoHideDuration={4000}
                    onClose={closeSnack}
                    message={snackbarMessage}
                    
                />
                        
            </div>
        </div>
        
        
    )
}

export default DeleteTextPopup;