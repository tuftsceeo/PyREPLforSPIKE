// Initially taken from https://mui.com/material-ui/react-drawer/

import React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import TerminalIcon from '@mui/icons-material/Terminal';
import FileOpenIcon from '@mui/icons-material/FileOpen';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';

import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import RestartAltIcon from '@mui/icons-material/RestartAlt';

import { Fab, Tooltip } from '@mui/material';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import UploadFile from './UploadFile';
import DeleteFile from './DeleteFile';

import { CONTROL_D } from "../Serial/Serial";

function SidebarMenu(props) {
  const [state, setState] = React.useState({
    right: false
  });

  const toggleDrawer = (anchor, open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  const [openDialogs, setOpenDialogs] = React.useState({
      executeLocalFile: false,
      deleteFiles: false
  })

  const fileTabs = [
    {
        title: "Upload Code to Device",
        onClick: () => {
            props.uploadCode();
        },
        icon: <UploadFileIcon />
    },

    {
        title: "Upload + Execute",
        onClick: () => {
            props.writeAndRunCode()
        },
        icon: <TerminalIcon />
    },

    {
      title: "Download Code",
      onClick: () => {
          props.downloadTxtFile();
      },
      icon: <FileDownloadIcon />
  },

    {
        title: "Execute Local File",
        onClick: () => {
            setOpenDialogs((prev) => {
              return {
                ...prev,
                executeLocalFile: true
              }
            })
        },
        icon: <FileOpenIcon />
    }
  ]

  const consoleTabs = [
    {
        title: "Clear Console",
        onClick: () => {
            props.clearConsole()
        },
        icon: <HighlightOffIcon />
    },

    {
        title: "Delete Files",
        onClick: () => {
          setOpenDialogs((prev) => {
            return {
              ...prev,
              deleteFiles: true
            }
          })
        },
        icon: <DeleteSweepIcon />
    },

    {
      title: "Restart w/o CTRL C",
      onClick: () => {
          props.writeToPort([CONTROL_D])
      },
      icon: <RestartAltIcon />
  },

    
  ];

  const list = (anchor) => (
    <Box
      sx={{ width: 250 }}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <List>
        {fileTabs.map((item, index) => (
          <ListItem key={item.title} onClick={item.onClick} disablePadding>
            <ListItemButton>
              <ListItemIcon>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.title} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        {consoleTabs.map((item, index) => (
          <ListItem key={item.title} onClick={item.onClick} disablePadding>
            <ListItemButton>
              <ListItemIcon>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.title} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );
  

  return (
    <div className={props.className}>
        
      {['right'].map((anchor) => (
        <div key={anchor}>
            <Tooltip title="More Options" placement="top">
                <Fab 
                    color="secondary" 
                    aria-label="add" 
                    size="small"
                    onClick={toggleDrawer(anchor, true)}
                >

                    <MoreHorizIcon />
                </Fab>
                
            </Tooltip>
            <Drawer
                anchor={anchor}
                open={state[anchor]}
                onClose={toggleDrawer(anchor, false)}
            >
                {list(anchor)}
            </Drawer>
        </div>
        
       
      ))}

      <UploadFile
        open={openDialogs.executeLocalFile} 
        closeDialog={() => {
          setOpenDialogs((prev) => {
            return {
              ...prev,
              executeLocalFile: false
            }
          })
        }}
      />

      <DeleteFile
        open={openDialogs.deleteFiles} 
        closeDialog={(confirmed, fileName="") => {
          console.log(confirmed)
          console.log(fileName)
          if (confirmed && fileName !== "") {
            props.writeToPort(['import os\r\n', 'os.remove("' + fileName + '")\r\n'])
          }
          setOpenDialogs((prev) => {
            return {
              ...prev,
              deleteFiles: false
            }
          })
        }}
      />
    </div>
  );
}


export default SidebarMenu