import React, {useState} from "react";
import InputSlider from "./InputComponents/InputSlider";

// Button Icon Import
import Tooltip from "@mui/material/Tooltip";
import SettingsIcon from '@mui/icons-material/Settings';
import Fab from '@mui/material/Fab';

// Popup Imports
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import ListItemText from '@mui/material/ListItemText';
import ListItem from '@mui/material/ListItem';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';

import { styled } from '@mui/material/styles';
import MuiInput from '@mui/material/Input';

// Checkbox Import
import Checkbox from '@mui/material/Checkbox';



const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const Input = styled(MuiInput)`
  width: 48px;
`;

function Settings(props) {
    const [open, setOpen] = React.useState(false);
    const tempSettings = props.settings

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        props.onSettingsUpdate()
    };

    return (
    <div>
        <div>
            <Tooltip title="Settings" placement="left">
                <Fab 
                    onClick={handleClickOpen}
                    color="primary" 
                    aria-label="add" 
                    size="small"
                >
                    <SettingsIcon />
                </Fab>
            </Tooltip>
        </div>
        <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
        >
        <AppBar sx={{ position: 'relative' }}>
            <Toolbar>
            <IconButton
                edge="start"
                color="inherit"
                onClick={handleClose}
                aria-label="close"
            >
                <CloseIcon />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                Settings
            </Typography>
            {/*
            <Button autoFocus color="inherit" onClick={handleSave}>
                Save
            </Button>
            */}
            </Toolbar>
        </AppBar>
        <List>
            <InputSlider 
                input={tempSettings.fontSize}
                onChange={(newFontSize) => {
                    tempSettings.fontSize = newFontSize;
                }}
            />
            <Divider />
            <ListItem >
                <ListItemText
                    primary="Enable Dark Mode"
                />
                <Checkbox
                />
            </ListItem>
        </List>
        </Dialog>
    </div>
    );
    
        
    
}

export default Settings;



