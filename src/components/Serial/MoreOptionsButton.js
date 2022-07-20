import React, { useState } from "react";

import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Tooltip from '@mui/material/Tooltip';

import Fab from '@mui/material/Fab';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

function MoreOptionsButton(props) {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        if (!open)
            setAnchorEl(event.currentTarget);
        else 
            setAnchorEl(false);
    };
    const handleClose = (functionToRun = () => {}) => {
        console.log(functionToRun)
        if (typeof functionToRun === "function")
            functionToRun();
        setAnchorEl(null);
    };

    return (
        <div className={props.className}>
            
            <Tooltip title="More Options" placement="top">
                <Fab 
                    color="secondary" 
                    aria-label="add" 
                    size="small"
                    onClick={handleClick}
                >

                    <MoreHorizIcon />
                </Fab>
            </Tooltip>
            
            <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                    'aria-labelledby': 'basic-button',
            }}
            >
                <MenuItem 
                    onClick={() => handleClose(() => {
                        props.uploadCode()
                    })}
                >
                    Upload File
                </MenuItem>
                <MenuItem 
                    onClick={() => handleClose(() => {
                        props.runCurrentCode();
                    })}
                >
                    Run Current File
                </MenuItem>
                <MenuItem 
                    onClick={() => handleClose(() => {
                        props.writeAndRunCode();
                    })}
                >
                    Upload + Run File
                </MenuItem>
                <MenuItem onClick={handleClose}>Coming Soon!</MenuItem>
            </Menu>
        </div>
    )
}

export default MoreOptionsButton;