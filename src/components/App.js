/*
 * App.js
 * By: Gabriel Sessions
 * Last Edit: 8/2/2022
 * 
 * Main Application File for PyREPL
 * 
 * Controls information flow from the Editor/Console Input to the Serial Port
 * and from the Serial Port to the Console
 * 
 */ 

import React, {useState} from "react";
import Header from "./Header";
import IDE from "./IDE";
import Tabs from"./Tabs/Tabs";
import Serial from "./Serial/Serial"
import Settings from "./Settings";
import ChromeCheck from "./ChromeCheck";
import Welcome from "./Welcome";

import { browserName, browserVersion } from "react-device-detect";

const FILE_PREFIX = "REPL_"; // Prefix for all REPL files saved to hub
const FILE_SUFFIX = ".py"; // Can also be .mpy
export { FILE_PREFIX, FILE_SUFFIX };

function App() {
    
    /**
     * Check if browser is valid
     * @param {string} browser - Name of the browser in use
     * @param {number} version - Version number of the browser in use
     * @returns A boolean indicating if the site can suppport the user's browser
     */
    function isValidBrowser(browser, version) {
        if ((browser === "Chrome" || browser === "Edge") && version > 89) {
            return true;
        }
        else if (browser === "Opera" && version > 75) {
            return true;
        }
        return false;
    }
    const validBrowser = isValidBrowser(browserName, browserVersion);

    // Initialization Code
    // Calls saved editor data from LocalStorage, if avaliable
    // and initializes the website with those values.
    const EDITOR_KEY = "appData";
    const SETTINGS_KEY = "settingsData"

    // Settings Initialization, may require tweaking based on 
    // screen height/width
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

    // User Interface state management
    const [editors, setEditors] = useState(editorInitialValue);
    const [activeIDE, setActiveIDE] = useState(0);
    const [consoleOutput, setConsoleOutput] = useState("");
    const [consoleInput, setConsoleInput] = useState("");
    const [newREPLEntry, setNewREPLEntry] = useState(false);

    // Check if the user is a first time visitor
    const FIRST_TIME_KEY = "firstTime";
    const firstTime = getLocalStorage(FIRST_TIME_KEY);
    // If first time, show welcome page. Otherwise, show the main REPL page.
    const [currentPage, setCurrentPage] = useState(firstTime == null ? "welcome" : "home");

    /**
     * Sets the current page to the home page once the user has been "welcomed".
     * Sends user to main page for all future visits.
     */
    function welcomed() {
        localStorage.setItem(FIRST_TIME_KEY, JSON.stringify(false));
        setCurrentPage("home");
    }

    /**
     * Adds a new REPL tab with an empty code editor
     * @param {string} newEditorName - Name for the newly created REPL Tab
     * 
     * Effects: Adds a new REPL to the end of the editors list
     */
    function addREPL(newEditorName) {
        setEditors((prev) => {
            return ([...prev, {
                name: newEditorName,
                id: (prev.length + 1),
                code: ""
            }])
        })
    }

    /**
     * @param {string} editorName - Name of the REPL tab to delete.
     * 
     * Effects: Filters and removes a specified editor from the editors list.
     * 
     * Note: Deletion is not permanent until the user edits another tab. 
     * Gives the user a chance to reload the page to recover the tab.
     */
    function deleteREPL(editorName) {
        setActiveIDE(0);
        setEditors((prev) => {
            return (prev.filter((element) => {
                return (FILE_PREFIX + element.name + FILE_SUFFIX) !== editorName;
            }))
        });
        // BUG: Why did I add this delay?
        setTimeout(() => {
            saveToLocalStorage(editors, EDITOR_KEY);
            console.log(editors)
        }, 2000);
        
    }

    /**
     * Retrieves serial port output (read) and re-renders the console 
     * with the read value.
     * @param {string} value - A new string to add to the console
     */
    function pipeOutputToConsole(value) {
        setConsoleOutput((prev) => {
            return prev + value;
        })
    }

    /**
     * Updates the code in the editor that is currently in use 
     * and saves the result to LocalStorage
     * @param {string} newCode - Code to insert into the current editor
     */
    function editCurrentFile(newCode) {
        setEditors((prev) => {
            prev[activeIDE].code = newCode;
            return (prev);
        })
        saveToLocalStorage(editors, EDITOR_KEY);
    }

    /**
     * Returns the code for the currently active editor
     * @returns A string with the code of the current tab
     */
    function getCurrentCode() {
        return editors[activeIDE].code;
    }

    /**
     * @returns The file name of the currently active tab 
     * (includes file prefix and suffix)
     */
    function getCurrentFileName() {
        return FILE_PREFIX + editors[activeIDE].name + FILE_SUFFIX;
    }

    /**
     * Saves the updated editor values to local storage
     * @param {Array<any>} values - Array of values to be stored into a 
     * JSON object based on index
     * @param {string} key - Key to identify the created object in local storage
     */
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
        <div className="-mb-4">
            {/* Shows an invalid browser error if using 
            an unsupported browser */}
            <ChromeCheck
                className={validBrowser ? "hidden" : ""}
            />
            
            {/* Shows a welcome message if the user hasn't 
            visited PyREPL before */}
            <Welcome
                className={validBrowser && (currentPage === "welcome") ? "" : "hidden"}
                welcomed={welcomed}
            />
            
            {/* Main PyREPL Page */}
            <div className={validBrowser && (currentPage === "home") ? "" : "hidden"}>
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
                                () => setConsoleOutput(">>> ")
                            }
                            
                        />
                    </div>

                    {/* Two column layout for the IDE.
                    Editor options on the left, console options on the right. */}
                    <div className="grid grid-cols-2">
                        <div className="flex mx-2 justify-center">
                            {/* Tabs for switching between editors */}
                            <Tabs 
                                switchIDE={setActiveIDE} 
                                addREPL={addREPL} 
                                fileName={getCurrentFileName()}
                                deleteREPL={deleteREPL}

                            />
                        </div>
                        <div>
                            {/* Serial connection options and manipulation */}
                            <Serial 
                                getCurrentCode={getCurrentCode} 
                                getCurrentFileName={getCurrentFileName}
                                exportConsole={pipeOutputToConsole} 
                                newREPLEntry={newREPLEntry}
                                setNewREPLEntry={setNewREPLEntry}
                                consoleInput={consoleInput}
                                setConsoleInput={setConsoleInput}
                                editors={editors}
                                clearConsole={
                                    () => setConsoleOutput(">>> ")
                                }
                            />
                        </div>
                    </div>

                    {/* Displays the current editor and console data */}
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
                                    consoleInput={consoleInput}
                                    setConsoleInput={setConsoleInput}
                                    setNewREPLEntry={setNewREPLEntry}
                                />
                            )
                        }) 
                    }
            </div>
        </div>
    );
}


export default App;