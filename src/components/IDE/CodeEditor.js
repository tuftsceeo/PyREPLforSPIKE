
import React, { useState } from "react";
import AceEditor from 'react-ace';
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/theme-github";

function CodeEditor(props) {

    const initCode = props.code;

    const [curCode, setCurCode] = useState(initCode);
    console.log(curCode);

    return (        
        <div className="border border-black" id={props.id}>
            {
                <AceEditor
                    onChange={props.onEdit}
                    mode="python"
                    theme="github"
                    width="500px"
                    height={(window.innerHeight * 0.7) + "px"}
                    value={props.code} 
                />
            }
        </div>
    )
        
    
}

export default CodeEditor;


