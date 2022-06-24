import React from "react";
import Fab from '@mui/material/Fab';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import Tooltip from "@mui/material/Tooltip";


function APIButton(props) {
    return (
        <div className={props.on ? "" : "hidden"}>
            <Tooltip title="Documentation" placement="top">
                <Fab 
                    onClick={() => {window.open(
                    props.link, "_blank");}} 
                    color={props.color} 
                    aria-label="add" 
                    size="small">
                    
                    <LibraryBooksIcon />

                </Fab>
            </Tooltip>
        </div>

    )
}

export default APIButton;