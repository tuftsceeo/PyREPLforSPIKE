/*
 * AddButton.js
 * By: Gabriel Sessions
 * Last Edit: 8/2/2022
 * 
 * Button to start the process of creating a new REPL tab and editor
 * 
 */ 

import React from "react"
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import Tooltip  from "@mui/material/Tooltip";

function AddButton(props) {

    return(
        <div >
            <div onClick={() => {
                props.onClick()
            }}>
                <Tooltip title="Add New REPL" placement="top">
                    <Fab color="primary" aria-label="add" size="small">
                        <AddIcon />
                    </Fab>
                </Tooltip>
            </div>
            
            
        </div>
    
    )

}

export default AddButton;