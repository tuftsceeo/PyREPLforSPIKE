import React, {useState} from "react";

import AddButton from "./AddButton";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Snackbar from "@mui/material/Snackbar";

function AddTextPopup(props) {
    const [open, setOpen] = useState(false);
    const [snackOpen, setSnackOpen] = useState(false);
    const [input, setInput] = useState("");
    const [snackbarMessage, setSnackbarMessage] = useState("");


    function handleOpen() {
        setOpen(true);
    }

    function handleClose(confirmed, submissionText = "") {
        setOpen(false);
        if (submissionText === "") {
            openSnack("REPL creation was cancelled");
        }
        else if (confirmed && submissionText !== "backdropClick") {
            openSnack('"' + submissionText + '" was added as a REPL');
            setInput("");
            props.addREPL(submissionText);
        }
        else {
            openSnack("REPL creation was cancelled");
        }
        
    }

    function openSnack(snackText) {
        setSnackbarMessage(snackText)
        setSnackOpen(true);
    }

    function closeSnack() {
        setSnackOpen(false);
    }

    function typing(event) {
        const newInput = event.target.value;
        setInput(newInput);
    }

    return (
        <div className={props.className}>
            <AddButton onClick={() => handleOpen()} />
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>{props.formTitle}</DialogTitle>
                <DialogContent>
                <DialogContentText>
                    {props.formBody}
                </DialogContentText>
                <TextField
                    autoFocus
                    margin="dense"
                    id="name"
                    label="REPL Name"
                    type="text"
                    fullWidth
                    variant="standard"
                    onChange={typing}
                    value={input}
                />
                </DialogContent>
                <DialogActions>
                <Button onClick={() => handleClose(false)}>Cancel</Button>
                <Button onClick={() => handleClose(true, input)}>Create REPL</Button>
                </DialogActions>
            </Dialog>

            <Snackbar
                open={snackOpen}
                autoHideDuration={4000}
                onClose={closeSnack}
                message={snackbarMessage}
                
            />
                    
        </div>
    )
}

export default AddTextPopup;