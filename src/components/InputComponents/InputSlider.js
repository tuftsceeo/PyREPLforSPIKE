/*
 * InputSlider.js
 * By: Gabriel Sessions
 * Last Edit: 8/2/2022
 * 
 * Input Slider component to be inserted into various settings/input cases
 * Mostly taken from MUI
 * 
 */ 

import React, {useState} from "react";

// Popup Imports

import ListItemText from '@mui/material/ListItemText';
import ListItem from '@mui/material/ListItem';
import Typography from '@mui/material/Typography';


// Slider Imports
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Slider from '@mui/material/Slider';
import MuiInput from '@mui/material/Input';
import TextFieldsIcon from '@mui/icons-material/TextFields';

const Input = styled(MuiInput)`
  width: 48px;
`;

function InputSlider(props) {
    const initValue = props.input;
    const [value, setValue] = useState(initValue);
    const handleSliderChange = (event, newValue) => {
        setValue(newValue);
        props.onChange(newValue);
    };

    const handleInputChange = (event) => {
        setValue(event.target.value === '' ? '' : Number(event.target.value));
        props.onChange(event.target.value === '' ? '' : Number(event.target.value))
    }
    const handleBlur = () => {
        if (value < 0) {
            setValue(0);
        } else if (value > 36) {
            setValue(36);
        }
    };


    return (
        <div>
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
        </div>
    )
}

export default InputSlider;