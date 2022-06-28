import React, {useState} from "react";

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

// Slider Imports
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Slider from '@mui/material/Slider';
import MuiInput from '@mui/material/Input';
import TextFieldsIcon from '@mui/icons-material/TextFields';



const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const Input = styled(MuiInput)`
  width: 48px;
`;

function Settings(props) {
    const [open, setOpen] = React.useState(false);
    const [tempSettings, setTempSettings] = React.useState(
        props.settings
    )

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleSave = () => {
        setOpen(false);
        console.log(tempSettings);
        props.setSettings(tempSettings);
        setTimeout(() => {
            console.log(props.settings);
        }, 1000);
    }

    const [value, setValue] = useState(tempSettings.fontSize);

    const handleSliderChange = (event, newValue) => {
        setValue(newValue);
        setTempSettings((prev) => {
            let settingsCopy = prev;
            settingsCopy.fontSize = newValue;
            return settingsCopy;
        });
    };

    const handleInputChange = (event) => {
        setValue(event.target.value === '' ? '' : Number(event.target.value));
        const value = event.target.value === '' ? '' : Number(event.target.value);
        setTempSettings((prev) => {
            let settingsCopy = prev;
            settingsCopy.fontSize = value;
            return settingsCopy;
        });
    }
    const handleBlur = () => {
        if (value < 0) {
            setValue(0);
        } else if (value > 50) {
            setValue(50);
        }
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
            <Button autoFocus color="inherit" onClick={handleSave}>
                save
            </Button>
            </Toolbar>
        </AppBar>
        <List>
            <ListItem>
                <ListItemText primary="Set Editor Text Size" />
                <Box sx={{ width: 250 }}>
                    <Typography id="input-slider" gutterBottom>
                        Text Size
                    </Typography>
                    <Grid container spacing={2} alignItems="center">
                        <Grid item>
                        <TextFieldsIcon />
                        </Grid>
                        <Grid item xs>
                        <Slider
                            value={typeof value === 'number' ? value : 0}
                            onChange={handleSliderChange}
                            aria-labelledby="input-slider"
                            max={36}
                            min={1}
                        />
                        </Grid>
                        <Grid item>
                        <Input
                            value={value}
                            size="small"
                            onChange={handleInputChange}
                            onBlur={handleBlur}
                            inputProps={{
                            step: 1,
                            min: 1,
                            max: 36,
                            type: 'number',
                            'aria-labelledby': 'input-slider',
                            }}
                        />
                        </Grid>
                    </Grid>
                </Box>
            </ListItem>
            <Divider />
            <ListItem >
                <ListItemText
                    primary="Open WebSerial Automatically"
                    secondary="Off"
                />
            </ListItem>
            <Divider />
            <ListItem >
                <ListItemText
                    primary="Enable Dark Mode"
                    secondary="Off"
                />
            </ListItem>
        </List>
        </Dialog>
    </div>
    );
    
        
    
}

export default Settings;



