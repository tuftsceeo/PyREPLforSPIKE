import React from "react"
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import StopCircleIcon from '@mui/icons-material/StopCircle';
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