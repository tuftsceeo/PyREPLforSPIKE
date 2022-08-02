/*
 * Tabs.js
 * By: Gabriel Sessions
 * Last Edit: 8/2/2022
 * 
 * Group of tabs above the text editor. Allows users to switch between editors
 * and changes the currently active IDE.
 * 
 */

import React, {useState, useEffect} from "react";
import ButtonGroup from '@mui/material/ButtonGroup';
import Tab from "./Tab";

import AddTextPopup from "./AddTextPopup";
import DeleteTextPopup from "./DeleteTextPopup";

import { FILE_PREFIX, FILE_SUFFIX } from "../App";


function Tabs(props) {

    const [activeTab, setActiveTab] = useState(0);
    let tabsInitValue = [{
        color: "primary",
        name: "Main",
        onClick: null
    }];
    const [tabs, setTabs] = useState(tabsInitValue);

    const LOCALSTORAGE_KEY = "appData"; 

    const ls = getLocalStorage() // why does this exist? use App.js localstorage
    if (ls != null) {
        const lsJSON = JSON.parse(ls)
        Object.values(lsJSON).forEach((value, key) => {
            if (key !== 0) {
                tabsInitValue.push({
                    color: "inherit",
                    name: value.name,
                    onClick: null
                });
            }
            
        });
    }


    /**
     * Switches active editor to a new specified editor
     * @param {number} tabTarget - tab target corresponds to index in tabs array
     */
    function switchTabs(tabTarget){
        setTabs((prev) => {
            prev[activeTab].color = "inherit";
            prev[activeTab].outlined = "inherit";
            prev[tabTarget].color = "primary";
            prev[tabTarget].outlined = "primary";

            return prev;
        })
        setActiveTab(tabTarget);

        props.switchIDE(tabTarget);
        
    }

    /**
     * Creates a new tab and editor and switches the active editor to the newly
     * created editor.
     * @param {string} tabName - name to initialize the newly created tab with
     */
    function addTab(tabName) {
        setTabs((prev) => {
            return ([...prev, {
                color: "primary",
                name: tabName,
                onClick: null
            }])
        })

        switchTabs(tabs.length);
        props.addREPL(tabName);
        props.switchIDE(tabs.length);
    }

    /**
     * Deletes a tab from the tab list
     * @param {*} tabName 
     */
    function removeTab(tabName) {
        switchTabs(0);
        props.switchIDE(0);
        setTabs((prev) => {
            let newTabs = [];
            prev.forEach(element => {
                if (FILE_PREFIX + element.name + FILE_SUFFIX !== tabName) {
                    newTabs.push(element);
                }
            });
            return newTabs;
        })
        props.deleteREPL(tabName)
        setTimeout(() => {
            console.log(tabs);
        }, 1000);
    }

    // Todo: remove and integrate App.js LS function
    function getLocalStorage() {
        return localStorage.getItem(LOCALSTORAGE_KEY);
    }


    // 97 - 105 are keys for numbers 1-9
    // Todo: Finish shortcut idea
    useEffect(() => {
        const key0 = 48; // key number for 0 number key
        const handleIDESwitch = (event) => {
            for (let i = 1; i <= 9; i++) {
                if (event.keyCode === (key0 + i) && event.altKey 
                && i < tabs.length + 1) {
                    switchTabs(i-1);
                }
            }
                
        };
        window.addEventListener('keydown', handleIDESwitch);

        return () => {
            window.removeEventListener('keydown', handleIDESwitch);
        };
    }, [tabs]);

    return (
        <div>
            <div className="flex -mb-4">
                <ButtonGroup variant="contained" aria-label="outlined inherit button group" color="inherit">
                    {

                        tabs.map((tab, index) => {
                            return (
                            <Tab 
                                key={index} 
                                id={index} 
                                color={tab.color} 
                                outlined={tab.outlined} 
                                name={tab.name} 
                                onClick={() => {switchTabs(index)}} 
                            />)
                        })
                    }
                    
                </ButtonGroup>
                <div className="mx-4 flex">
                    <AddTextPopup formTitle="Create a new REPL" formBody="Enter a name for your new REPL environment: " addREPL={addTab} className="mr-4" />
                    <DeleteTextPopup formTitle={"Delete " + props.fileName } formBody="Your code from this REPL will be permanently deleted" deleteREPL={removeTab}
                    fileName={props.fileName} />
                </div>
                
            </div>
            
        </div>
    )

}


export default Tabs;