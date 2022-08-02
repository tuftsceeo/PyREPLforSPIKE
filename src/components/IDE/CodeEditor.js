/*
 * CodeEditor.js
 * By: Gabriel Sessions
 * Last Edit: 8/2/2022
 * 
 * Component for the main code editor the use can interact with
 * Uses the react-ace editor 
 * 
 */ 


import React, { useState } from "react";
import AceEditor from 'react-ace';
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/theme-github";

function CodeEditor(props) {

    // BUG: Why did I create a new state object for this?
    const [editorSettings, setEditorSettings] = useState(props.settings);

    return (        
        <div className="border border-black" id={props.id}>
            {
                <AceEditor
                    onChange={props.onEdit}
                    mode="python"
                    theme="github"
                    width={editorSettings.editorWidth + "px"}
                    height={editorSettings.editorHeight + "px"}
                    value={props.code} 
                    fontSize={editorSettings.fontSize}
                />
            }
        </div>
    )
        
    
}

export default CodeEditor;

