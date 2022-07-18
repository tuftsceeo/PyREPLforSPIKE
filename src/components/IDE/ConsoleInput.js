
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

import React, {useEffect, useState, useRef} from "react";

function ConsoleInput(props) {

    const [upStack, setUpStack] = useState([""]);
    const [downStack, setDownStack] = useState([""]);

    const ref = useRef(null);
    const TAB = '\x09'

    useEffect(() => {
        const keyDownHandler = event => {
            
            if (event.key === 'Enter' && document.activeElement == ref.current) {
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
            else if (event.key === "ArrowUp" && upStack != undefined &&  upStack.length > 0) {
                event.preventDefault();
                setDownStack((prev) => {
                    console.log(prev);
                    return [...prev, props.consoleInput]
                });
                props.setConsoleInput(upStack[upStack.length - 1])
                setUpStack((prev) => {
                    let prevArr = [...prev];
                    prevArr.pop();
                    return prevArr;
                });
                setTimeout(() => {
                    console.log(upStack);
                }, 1000);
            }

            else if (event.key === "ArrowDown" && downStack != undefined &&  downStack.length > 0) {
                console.log(downStack);
                event.preventDefault();
                setUpStack((prev) => [...prev, props.consoleInput]);
                props.setConsoleInput(downStack[downStack.length - 1])
                setDownStack((prev) => {
                    console.log(prev);
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
    

    return (
        <div className={"flex justify-start my-2"} >
            <Box
            component="form"
            sx={{
                '& > :not(style)': { m: 1, width: (Math.floor(window.innerWidth/18.5)) + 'ch' },
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