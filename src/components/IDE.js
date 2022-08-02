/*
 * IDE.js
 * By: Gabriel Sessions
 * Last Edit: 8/2/2022
 * 
 * Combined Editor and Console component
 * 
 * Controls the relative layout of the console and editor with repect to each
 * other in a two-column layout
 * 
 */ 

import React from "react";
import CodeEditor from "./IDE/CodeEditor";
import Console from "./IDE/Console";

function IDE(props) {

    return (
        <div className="grid grid-cols-2 my-4">
            <div className="mx-2 flex justify-center">
                <div className="block">
                    <CodeEditor 
                        onEdit={props.onEdit} 
                        id={props.id + "console"} 
                        code={props.code}
                        settings={props.settings}
                    /> 
                </div>
                
            </div>

            <div className="mx-4">
                <Console 
                    id={props.id + "console"} 
                    content={props.content} 
                    consoleInput={props.consoleInput}
                    setConsoleInput={props.setConsoleInput}
                    setNewREPLEntry={props.setNewREPLEntry}
                />
            </div>
            
        </div>
    )
}


export default IDE;