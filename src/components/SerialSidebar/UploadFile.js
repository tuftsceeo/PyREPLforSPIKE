/*
 * UploadFile.js
 * By: Gabriel Sessions
 * Last Edit: 8/2/2022
 * 
 * In Progress - Popup that allows users to upload files directly 
 * to the microprocessor device
 * 
 * Prompts the user to upload files from a local filesystem. 
 * Uploaded files will be read and then sent to the microprocessor as files.
 * 
 */ 

import React, {useState} from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import UploadIcon from '@mui/icons-material/Upload';
import {useDropzone} from 'react-dropzone';

export default function UploadFile(props) {


    return (
    <div>
        <Dialog open={props.open} onClose={props.closeDialog}>
            <DialogTitle>Upload Python/Micropython Files</DialogTitle>
            <DialogContent>
            <DialogContentText>
                Upload .py or .mpy files below, they will be executed in the order they are uploaded.
            </DialogContentText>
            <Dropzone />
            </DialogContent>
            <DialogActions>
            <Button onClick={props.closeDialog}>Cancel</Button>
            <Button onClick={props.closeDialog}>Execute</Button>
            </DialogActions>
        </Dialog>
      </div>
    )
}


function Dropzone(props) {
    const {acceptedFiles, getRootProps, getInputProps} = useDropzone({
      accept: {
        'text/html': ['.py', '.mpy', '.txt'],
      }
    });

    
    
    const files = acceptedFiles.map(file => (
      <li key={file.path}>
        {file.path} - {file.size} bytes
      </li>
    ));
  
    return (
      <section className="container">
        <div {...getRootProps({className: 'dropzone'})}>
            <div className='my-4'>
                <Button variant="contained" endIcon={<UploadIcon />}>
                    Upload Files
                </Button>
                <input {...getInputProps()} />
                <p>(NOT FUNCTIONAL YET)</p>
            </div>
          
        </div>
        <aside>
          <h4>Files</h4>
          <ul>{files}</ul>
        </aside>
      </section>
    )
}