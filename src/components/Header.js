/*
 * Header.js
 * By: Gabriel Sessions
 * Last Edit: 8/2/2022
 * 
 * Component to display the Header portion for the site.
 * For now, it's just the title of the site: Web PyREPL
 * 
 */ 

import React from "react";
import Typography from '@mui/material/Typography';

function Header() {
    return (
        <div className="text-center my-4">
            <Typography variant="h3" component="div" gutterBottom>
                Web PyREPL
            </Typography>
        </div>
    )
}

export default Header;