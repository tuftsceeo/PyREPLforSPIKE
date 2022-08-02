/*
 * Tab.js
 * By: Gabriel Sessions
 * Last Edit: 8/2/2022
 * 
 * Individual tab button in the tabs list. Allows users to switch to a
 * particular REPL editor.
 * 
 */

import React from "react";
import Button from '@mui/material/Button';

function Tab(props) {
    return (
        <Button size="small" onClick={props.onClick} color={props.color} outlined={props.outlined}> {props.name} </Button>
    )
}

export default Tab;