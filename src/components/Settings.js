/*
 * Settings.js
 * By: Gabriel Sessions
 * Last Edit: 8/12/2022
 * 
 * Settings page triggered by clicking the gear icon in the upper-right corner
 * 
 * Controls the global site settings.
 * 
 */ 

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

// User input imports
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import ToggleButton from "@mui/material/ToggleButton";

// Clear Console Button icon
import DeleteIcon from '@mui/icons-material/Delete';
import { Snackbar } from "@mui/material";


// Slide up transition when the settings button is clicked
const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

function Settings(props) {
    // Settings state management
    const [open, setOpen] = useState(false);
    const [snackOpen, setSnackOpen] = useState(false);
    const [snackMessage, setSnackMessage] = useState("");

    const [alignment, setAlignment] = React.useState('spike3');

    const handleChange = (event, newAlignment) => {
        console.log(newAlignment)
        setAlignment(newAlignment);
    };

    /**
     * Opens a snackbar in the lower left of the screen with a message
     * @param {string} message - Text to be displayed inside the snackbar
     */
    function openSnack(message) {
        setSnackMessage(message);
        setSnackOpen(true);
    }

    /**
     * Closes the snackbar, if displayed
     */
    function closeSnack() {
        setSnackOpen(false);
    }

    // BUG: Why does this variable exist?
    const tempSettings = props.settings

    /**
     * Opens the settings menu
     */
    const handleClickOpen = () => {
        setOpen(true);
    };

    /**
     * Closes the settings menu and updates the global settings
     */
    const handleClose = () => {
        setOpen(false);
        props.onSettingsUpdate()
    };

    return (
    <div>
        {/* Settings button to trigger settings menu */}
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

        {/* Main Settings Menu */}
        <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
        >
        <AppBar sx={{ position: 'relative' }}>
            <Toolbar>
                {/* "X" Button to close the settings menu */}
                <IconButton
                    edge="start"
                    color="inherit"
                    onClick={handleClose}
                    aria-label="close"
                >
                    <CloseIcon />
                </IconButton>

            {/* Settings menu title */}
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                Settings
            </Typography>
            </Toolbar>

        {/* Settings body */}
        </AppBar>
        <List>
            {/* Font Size */}
            <InputSlider 
                input={tempSettings.fontSize}
                onChange={(newFontSize) => {
                    tempSettings.fontSize = newFontSize;
                }}
            />
            <Divider />
            <ListItem >
                {/* Clear Console Button */}
                <ListItemText
                    primary="Clear Console Output"
                />
                <Button 
                    variant="contained" 
                    startIcon={<DeleteIcon />}
                    onClick={() => {
                        openSnack("Console Output Cleared")
                        props.clearConsole("")
                    }}
                >
                    Clear Console
                </Button>
               
            </ListItem>

            <Divider />

            {/* Documentation Button Link Change */}
            <ListItem >
                {/* Clear Console Button */}
                <ListItemText
                    primary="Documentation Button Link"
                />
                <ToggleButtonGroup
                    color="primary"
                    value={alignment}
                    exclusive
                    onChange={handleChange}
                >
                    <ToggleButton value="spike3">SPIKE 3</ToggleButton>
                </ToggleButtonGroup>
               
            </ListItem>

        </List>
        </Dialog>

        <Snackbar
            open={snackOpen}
            autoHideDuration={5000}
            onClose={closeSnack}
            message={snackMessage}
        />
    </div>
    );  
}

export default Settings;


