/*
 * Console.js
 * By: Gabriel Sessions
 * Last Edit: 8/2/2022
 * 
 * Component to display the console on the MicroPython REPL to the user 
 * 
 */ 

import React, {useRef, useEffect} from "react";
import ConsoleInput from "./ConsoleInput"

function Console(props) {

    const scrollRef = useRef(null);

    // When console is updated, scrolls the console to the bottom
    useEffect(() => {
        try {
            scrollRef.current.scrollIntoView({ behavior: 'smooth' });
        }
        catch(e) {
            console.log("cannot scroll to bottom of console");
        }
        
    });

    return (
        <div>
            {/* Change the max console height here */}
            <div style={{maxHeight: window.innerHeight*0.6+"px"}} className="resize-none border border-black overflow-scroll bg-white">
                <p 
                    className="text-decoration-line: underline text-center"
                >
                    Console
                </p>
                <br />
                {/* Need to split the console output into multiple lines 
                by \n characters */}
                {(props.content.split('\n')).map((element, index) => {
                    return (
                    <div ref={scrollRef} key={index}>
                        <p>{element}</p>
                    </div>)
                })}

            </div>
            <div>
                {/* Console input to send lines to the REPL */}
                <ConsoleInput 
                    consoleInput={props.consoleInput}
                    setConsoleInput={props.setConsoleInput}
                    setNewREPLEntry={props.setNewREPLEntry}
                />
            </div>
        </div>
    )
}

export default Console;