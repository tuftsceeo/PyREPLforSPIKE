import React from "react";
import Button from '@mui/material/Button';

function Tab(props) {
    return (
        <Button size="small" onClick={props.onClick} color={props.color} outlined={props.outlined}> {props.name} </Button>
    )
}

export default Tab;