
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

import React, {useEffect, useState, useRef} from "react";

function ConsoleInput(props) {

    const [input, setInput] = useState(props.consoleInput);
    const ref = useRef(null);
    const TAB = '\x09'

    useEffect(() => {
        const keyDownHandler = event => {
            console.log('User pressed: ', event.key);
    
            if (event.key === 'Enter' && document.activeElement == ref.current) {
                event.preventDefault();
                console.log("changed")
                props.setNewREPLEntry(true);
            }

            // Handled in Serial.js
            else if ((event.key === "Tab" || event.key == "Control") && document.activeElement == ref.current) {
                event.preventDefault();
                props.setNewREPLEntry(true);
            }

        };
    
        document.addEventListener('keydown', keyDownHandler);
    
        return () => {
          document.removeEventListener('keydown', keyDownHandler);
        };
    }, []);

    return (
        <div className={"flex justify-start my-2"} >
            <Box
            component="form"
            sx={{
                '& > :not(style)': { m: 1, width: '69ch' },
            }}
            noValidate
            autoComplete="off"
            >
            
            <TextField  
                label="Console Input" 
                variant="outlined"
                id="consoleInput"
                onChange={(event) => {
                    const newInput = event.target.value;
                    if (event.key === 'Enter') {
                        window.location.href("https://google.com")
                    }
                    props.setConsoleInput(newInput);
                }} 
                value={props.consoleInput}
                inputRef={ref}
                
            />
            </Box>
        </div>
    )
}

export default ConsoleInput;