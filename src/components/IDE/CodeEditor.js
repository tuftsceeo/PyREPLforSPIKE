
import React, { useState } from "react";
import AceEditor from 'react-ace';
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/theme-github";
import Settings from "@mui/icons-material/Settings";

function CodeEditor(props) {

    //const [curCode, setCurCode] = useState(initCode);
    console.log(props.settings.fontSize);
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


