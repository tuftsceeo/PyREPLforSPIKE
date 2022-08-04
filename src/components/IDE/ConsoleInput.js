/*
 * ConsoleInput.js
 * By: Gabriel Sessions
 * Last Edit: 8/2/2022
 * 
 * Firebase app services initialization and configuration management 
 * 
 */ 

import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

import React, {useEffect, useState, useRef} from "react";

function ConsoleInput(props) {

    // Console input state management, controls up/down arrow stacks
    const [upStack, setUpStack] = useState([""]);
    const [downStack, setDownStack] = useState([""]);

    const ref = useRef(null);

    function resetStack(upStack, downStack) {
        //console.log(upStack);
    }

    useEffect(() => {
        const keyDownHandler = event => {
            
            if (event.key === 'Enter' && document.activeElement == ref.current) {
                event.preventDefault();
                
                setUpStack((prev) => {
                    return [...prev, props.consoleInput]
                });
                
                props.setNewREPLEntry(true);
                resetStack(setUpStack, setDownStack);
            }
            

            // Handled in Serial.js
            // Triggers tab key REPL input if tab is pressed inside the text box
            else if ((event.key === "Tab") && document.activeElement == ref.current) {
                event.preventDefault();
                props.setNewREPLEntry(true);
            }
            
            // Up arrow implementation
            else if (event.key === "ArrowUp" && upStack !== undefined &&  upStack.length > 0) {
                event.preventDefault();
                setDownStack((prev) => {
                    return [...prev, props.consoleInput]
                });
                props.setConsoleInput(upStack[upStack.length - 1])
                setUpStack((prev) => {
                    let prevArr = [...prev];
                    prevArr.pop();
                    return prevArr;
                });
                
            }

            // Down arrow implementation
            else if (event.key === "ArrowDown" && downStack !== undefined &&  downStack.length > 0) {
                event.preventDefault();
                setUpStack((prev) => [...prev, props.consoleInput]);
                props.setConsoleInput(downStack[downStack.length - 1])
                setDownStack((prev) => {
                    let prevArr = [...prev];
                    prevArr.pop();
                    return prevArr;
                })
            }
            

        };
    
        document.addEventListener('keydown', keyDownHandler);
    
        return () => {
          document.removeEventListener('keydown', keyDownHandler);
        };
    }, [props]);
    

    // Text box for console input
    return (
        <div className={"flex justify-start my-2"} >
            <Box
            component="form"
            sx={{
                '& > :not(style)': { width: (Math.floor(window.innerWidth/18.5)) + 'ch' },
            }}
            noValidate
            autoComplete="off"
            >
            
            <TextField  
                label="Console Input" 
                id="consoleInput"
                onChange={(event) => {
                    const newInput = event.target.value;
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