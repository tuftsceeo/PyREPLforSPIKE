/*
 * SaveToSlot.js
 * By: Gabriel Sessions
 * Last Edit: 8/2/2022
 * 
 * IN PROGRESS - Popup for saving code to the hub
 * Saves current code in the IDE editor to a slot as "NUMBER.py"
 * where NUMBER is the input submitted in the popup form.
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
    const [slot, setSlot] = useState(0);

    return (
    <div>
        <Dialog open={props.open} onClose={() => {
            props.closeDialog(false)
        }}>
            <DialogTitle>Delete Python/Micropython Files</DialogTitle>
            <DialogContent>
            <DialogContentText>
                Which slot would you like to save your program to? (**Only works with CEEO custom slot management program**)
            </DialogContentText>
            <TextField
                autoFocus
                margin="dense"
                id="name"
                label="Slot Number (0-9)"
                type="text"
                fullWidth
                variant="standard"
                onChange={(e) => setSlot(e.target.value)}
                value={slot}
            />
            </DialogContent>
            <DialogActions>
            <Button onClick={() => {
                props.closeDialog(false)
            }}>Cancel</Button>
            <Button onClick={() => {
                props.closeDialog(true, slot + ".py")
            }}>Save</Button>
            </DialogActions>
        </Dialog>
      </div>
    )
}