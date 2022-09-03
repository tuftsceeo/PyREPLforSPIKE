/*
 * SidebarMenu.js
 * By: Gabriel Sessions
 * Last Edit: 9/3/2022
 * 
 * Sidebar that appears when the "more options" button is pressed in the IDE
 * with options to manipulate the os filesystem.
 * 
 */ 

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
import SaveIcon from '@mui/icons-material/Save';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';

import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import RestartAltIcon from '@mui/icons-material/RestartAlt';

import { Fab, Tooltip } from '@mui/material';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import UploadFile from './UploadFile';
import DeleteFile from './DeleteFile';
import SaveToSlot from "./SaveToSlot";
import HubSetup from './HubSetup';

import { CONTROL_A, CONTROL_B, CONTROL_D, CONTROL_E } from "../Serial/Serial";
import getScript from './setup_script';



function SidebarMenu(props) {
  // Tracks the current state of the sidebar
  const [state, setState] = React.useState({
    right: false
  });

  // Opens and closes the sidebar
  const toggleDrawer = (anchor, open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  // Tracks the state of each popup
  const [openDialogs, setOpenDialogs] = React.useState({
      executeLocalFile: false,
      deleteFiles: false,
      saveToSlot: false,
      hubSetup: false
  })

  // Tabs in the sidebar and behaviors when they are clicked
  // Split into two sections: "file" and "console"
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
    },

    {
      title: "Setup Hub*",
      onClick: () => {
          setOpenDialogs((prev) => {
            return {
              ...prev,
              hubSetup: true
            }
          })
      },
      icon: <AppRegistrationIcon />
    },

    {
      title: "Save to Slot*",
      onClick: () => {
          setOpenDialogs((prev) => {
            return {
              ...prev,
              saveToSlot: true
            }
          })
      },
      icon: <SaveIcon/>
    },

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

  // Renders all of the sidebar buttons as a list
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

      <SaveToSlot
        open={openDialogs.saveToSlot} 
        closeDialog={(confirmed, slot) => {
          if (confirmed)
              props.writeToPort([CONTROL_E, 'import os\r\n', 'os.chdir("/flash/'+ slot.split(".py")[0] +'/")\r\n', 'f = open("program.py", "w")\r\n', 'f.write("""' + props.currentCode() + '""")\r\n', 'f.close()\r\n', CONTROL_D]);
          setOpenDialogs((prev) => {
            return {
              ...prev,
              saveToSlot: false
            }
          })
        }} 
      />

      <HubSetup 
        open={openDialogs.hubSetup} 
        closeDialog={async (confirmed, hubName="") => {
          console.log(confirmed)
          console.log(hubName)
          if (confirmed && hubName !== "") {
            const script = getScript(hubName);
            await props.writeToPort([CONTROL_E])
            
            script.forEach(element => {
              props.writeToPort(element + "\r\n");
            });

            await props.writeToPort([CONTROL_D])
            
            
            
          }
          setOpenDialogs((prev) => {
            return {
              ...prev,
              hubSetup: false
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