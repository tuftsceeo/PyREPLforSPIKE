/*
 * HubSetup.js
 * By: Gabriel Sessions
 * Last Edit: 9/3/2022
 * 
 * Runs a hub setup script upon confirmation
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

export default function SaveToSlot(props) {
    const [hubName, setName] = useState("SPIKE");

    return (
    <div>
        <Dialog open={props.open} onClose={() => {
            props.closeDialog(false)
        }}>
            <DialogTitle>Setup Hub/Reset Hub</DialogTitle>
            <DialogContent>
            <DialogContentText>
                WARNING: This will wipe all user files from the hub!
            </DialogContentText>
            <TextField
                autoFocus
                margin="dense"
                id="name"
                label="New hub name"
                type="text"
                fullWidth
                variant="standard"
                onChange={(e) => setName(e.target.value)}
                value={hubName}
            />
            </DialogContent>
            <DialogActions>
            <Button onClick={() => {
                props.closeDialog(false)
            }}>Cancel</Button>
            <Button onClick={() => {
                props.closeDialog(true, hubName);
            }}>Execute Setup</Button>
            </DialogActions>
        </Dialog>
      </div>
    )
}