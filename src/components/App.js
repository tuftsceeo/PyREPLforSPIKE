/*
 * App.js
 * By: Gabriel Sessions
 * Last Edit: 6/21/2022
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


function App() {

    // Initialization Code
    // Calls saved editor data from LocalStorage, if avaliable
    // and initializes the website with those values.
    const LOCALSTORAGE_KEY = "appData";

    let editorInitialValue = null;
    const ls = getLocalStorage();
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


    // BUG: Generate unique IDs (generator or editor name)
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
        saveToLocalStorage();
    }

    function getCurrentCode() {
        return editors[activeIDE].code;
    }

    function saveToLocalStorage() {
        let editorJSON = {}
        editors.forEach((element, index) => {
            editorJSON[index]  = element;
        });
        localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(editorJSON))
        
    }

    function getLocalStorage() {
        return localStorage.getItem(LOCALSTORAGE_KEY);
    }


    // Outputs serial directions and a button to connect to WebSerial
    return (
        <div>
            <Header />
            <div className="grid grid-cols-2">
                <div className="flex mx-2 justify-center">
                    <Tabs switchIDE = {setActiveIDE} addREPL={addREPL} />
                </div>
                <div>
                    <Serial getCurrentCode={getCurrentCode} exportConsole={pipeOutputToConsole} />
                </div>
            </div>

            {   editors.filter((editor, index) => {
                    return index === activeIDE;
                }).map((editor) => {
                    return (
                        <IDE key={editor.id} id={editor.id} content={consoleOutput} code={editor.code} onEdit={editCurrentFile}/>
                    )
                }) 
            }
        </div>
    );
}


export default App;