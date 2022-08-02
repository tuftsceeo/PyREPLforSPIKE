/*
 * DeleteFile.js
 * By: Gabriel Sessions
 * Last Edit: 8/2/2022
 * 
 * Popup that appears when the user selects the delete file option 
 * in the sidebar. Deletes a specified file from the device filesystem.
 * 
 */ 

import React, {useState} from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';

export default function DeleteFile(props) {
    const [path, setPath] = useState("");

    return (
    <div>
        <Dialog open={props.open} onClose={() => {
            props.closeDialog(false)
            setPath("");
        }}>
            <DialogTitle>Delete Python/Micropython Files</DialogTitle>
            <DialogContent>
            <DialogContentText>
                Specify the file path of the file to be deleted (Ex: REPL_Test.py)
            </DialogContentText>
            <TextField
                autoFocus
                margin="dense"
                id="name"
                label="File Path"
                type="text"
                fullWidth
                variant="standard"
                onChange={(e) => setPath(e.target.value)}
                value={path}
            />
            </DialogContent>
            <DialogActions>
            <Button onClick={() => {
                props.closeDialog(false)
                setPath("");
            }}>Cancel</Button>
            <Button onClick={() => {
                props.closeDialog(true, path)
                setPath("");
            }}>Delete</Button>
            </DialogActions>
        </Dialog>
      </div>
    )
}