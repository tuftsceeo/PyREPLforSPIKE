/*
 * DeleteButton.js
 * By: Gabriel Sessions
 * Last Edit: 8/2/2022
 * 
 * Button to start the process of deleting an previously created REPL tab/editor
 * 
 */

import React from "react"
import Fab from '@mui/material/Fab';
import DeleteIcon from '@mui/icons-material/Delete';
import Tooltip  from "@mui/material/Tooltip";

function DeleteButton(props) {

    return(
        <div >
            <div onClick={() => {
                props.onClick()
            }}>
                <Tooltip title="Delete REPL" placement="top">
                    <Fab color="error" aria-label="add" size="small">
                        <DeleteIcon />
                    </Fab>
                </Tooltip>
            </div>
            
            
        </div>
    
    )

}

export default DeleteButton;