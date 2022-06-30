/*
 * App.js
 * By: Gabriel Sessions
 * Last Edit: 6/24/2022
 * 
 * Main Application File for PyREPL
 * 
 * Controls information flow from the Editor to the Serial Port
 * and from the Serial Port to the User Interface
 * 
 */ 

import React, {useState} from "react";
import Header from "./Header";
import IDE from "./IDE";
import Tabs from"./Tabs/Tabs";
import Serial from "./Serial/Serial"
import Settings from "./Settings";


function App() {
    // Initialization Code
    // Calls saved editor data from LocalStorage, if avaliable
    // and initializes the website with those values.
    const EDITOR_KEY = "appData";
    const SETTINGS_KEY = "settingsData"

    // Settings Initialization
    let settingsInitialValue = null;
    const settingsLS = getLocalStorage(SETTINGS_KEY);
    if (settingsLS === null) {
        settingsInitialValue = {
            fontSize: 12,
            darkMode: false,
            editorWidth: window.innerWidth * 0.4,
            editorHeight: window.innerHeight * 0.75
        }
    }
    else {
        settingsInitialValue = JSON.parse(settingsLS)
    }

    const [settings, setSettings] = useState(settingsInitialValue);

    // Editor Initialization
    // Fetches data from past sessions (if possible)
    let editorInitialValue = null;
    const ls = getLocalStorage(EDITOR_KEY);
    if (ls == null) {
        editorInitialValue = [{
            name: "Main",
            id: 0,
            code: ""
        }]
    }
    else {
        editorInitialValue = [];
        const lsJSON = JSON.parse(ls)
        Object.values(lsJSON).forEach((value, key) => {
            editorInitialValue.push(value);
        });
    }

    const [editors, setEditors] = useState(editorInitialValue);
    const [activeIDE, setActiveIDE] = useState(0);
    const [consoleOutput, setConsoleOutput] = useState("");

    console.log(settings)

    // BUG: Generate unique IDs (generator or editor name)
    // so we can later delete REPLs

    // AddREPL
    // Adds a new editor to the editors array
    function addREPL(newEditorName) {
        setEditors((prev) => {
            return ([...prev, {
                name: newEditorName,
                id: (prev.length + 1),
                code: ""
            }])
        })
    }

    // pipeOutputToConsole(value)
    // 
    // Retrieves serial port output (read) and re-renders
    // the console with the read value.
    //
    // Parameter: A new string to add to the console
    function pipeOutputToConsole(value) {
        setConsoleOutput((prev) => {
            return prev + value;
        })
    }


    // Updates the code in the editor that is currently in use
    // and saves the result to LocalStorage
    function editCurrentFile(newCode) {
        setEditors((prev) => {
            prev[activeIDE].code = newCode;
            return (prev);
        })
        saveToLocalStorage(editors, EDITOR_KEY);
    }

    function getCurrentCode() {
        return editors[activeIDE].code;
    }

    // Saves code from an array to LocalStorage
    // Parameters
    function saveToLocalStorage(values, key) {
        let valuesJSON = {}
        values.forEach((element, index) => {
            valuesJSON[index]  = element;
        });
        localStorage.setItem(key, JSON.stringify(valuesJSON))
        
    }

    // Fetches data stored with a specific key in LocalStorage
    function getLocalStorage(key) {
        return localStorage.getItem(key);
    }

    // Returns the entire App with all rendered components
    return (
        <div>
            <Header />
            <div className="absolute right-4 top-4">
                <Settings 
                    settings={settings}
                    setSettings={(newSettings) => setSettings(newSettings)} 
                    onSettingsUpdate={() => {
                        const curIDE = activeIDE;
                        setActiveIDE(0);
                        setActiveIDE(curIDE);
                    }}
                    clearConsole={
                        setConsoleOutput
                    }
                    
                />
            </div>
            <div className="grid grid-cols-2">
                <div className="flex mx-2 justify-center">
                    <Tabs switchIDE = {setActiveIDE} addREPL={addREPL} />
                </div>
                <div>
                    <Serial getCurrentCode={getCurrentCode} exportConsole={pipeOutputToConsole} />
                </div>
            </div>

            {editors.filter((editor, index) => {
                    return index === activeIDE;
                }).map((editor) => {
                    return (
                        <IDE 
                            key={editor.id} 
                            id={editor.id} 
                            content={consoleOutput} 
                            code={editor.code} 
                            onEdit={editCurrentFile}
                            settings={settings}
                        />
                    )
                }) 
            }
        </div>
    );
}


export default App;