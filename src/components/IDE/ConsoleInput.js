import React from "react";
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

function ConsoleInput(props) {

    return (
        <div className={"flex justify-start my-2"}>
            <Box
            component="form"
            sx={{
                '& > :not(style)': { m: 1, width: '65ch' },
            }}
            noValidate
            autoComplete="off"
            >
            <TextField  
                label="Console Input" 
                variant="outlined"
                id="consoleInput"
                onChange={() => props.onConsoleEdit()} 
                value={"Does Not Work Yet"}
            />
            </Box>
        </div>
    )
}

export default ConsoleInput;