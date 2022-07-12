
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

import React, {useEffect, useState, useRef} from "react";

function ConsoleInput(props) {

    const [upStack, setUpStack] = useState([]);
    const [downStack, setDownStack] = useState([]);

    const ref = useRef(null);
    const TAB = '\x09'

    useEffect(() => {
        const keyDownHandler = event => {
            console.log('User pressed: ', event.key);
            
            
            if (event.key === 'Enter' && document.activeElement == ref.current) {
                console.log(upStack)
                event.preventDefault();
                
                setUpStack((prev) => {
                    return [...prev, props.consoleInput]
                });
                
                props.setNewREPLEntry(true);
            }
            

            // Handled in Serial.js
            else if ((event.key === "Tab" || event.key == "Control") && document.activeElement == ref.current) {
                event.preventDefault();
                props.setNewREPLEntry(true);
            }
            
            // Up/Down arrow implementation
            else if (event.key === "ArrowUp" && upStack.length > 0) {
                event.preventDefault();
                setDownStack((prev) => [...prev, props.consoleInput]);
                props.setConsoleInput(upStack[upStack.length - 1])
                setUpStack((prev) => {
                    prev.filter((element, index) => {
                        return index != prev.length - 1
                    })
                })
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
                id="consoleInput"
                onChange={(event) => {
                    const newInput = event.target.value;
                    if (event.key === 'Enter') {
                        window.location.href("https://google.com")
                    }
                    props.setConsoleInput(newInput);
                }} 
                variant="filled"
                value={props.consoleInput}
                inputRef={ref}
                
            />
            </Box>
        </div>
    )
}

export default ConsoleInput;