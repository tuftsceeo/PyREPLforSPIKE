import React, {useState, useEffect} from "react";
import SerialButton from "./SerialButton";
import APIButton from "./APIButton";

import Tooltip from "@mui/material/Tooltip";
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import StopCircleIcon from '@mui/icons-material/StopCircle';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import Fab from '@mui/material/Fab';
import SidebarMenu from "../SerialSidebar/SidebarMenu";

const VENDOR_ID = 0x0694; // LEGO SPIKE Prime Hub

let port = null;

export const CONTROL_C = '\x03'; // CTRL-C character 
export const CONTROL_D = '\x04'; // CTRL-D character
export const CONTROL_E = '\x05'; // CTRL-E character
export const ENTER = '\r\n' // NEWLINE character
export const TAB = '\x09' // TAB character

const docsLink = "https://spike3-docs.web.app/";

let isWriteInit = false;
let textEncoder;
let writableStreamClosed;

let reader;
let writer;
let lockedReader = false;

function Serial(props) {

    let [stopCode, setStopCode] = useState(false);

    /*
        InitWebSerial
        - Initializes a Web Serial Port and returns the initialized port
        - Returns the port if successful, null otherwise
    */
    async function initWebSerial() {
        port = await navigator.serial.getPorts();

        port = await navigator.serial.requestPort(
            
        );

        // wait for the port to open.
        try {
            await port.open({ baudRate: 115200 });
        }
        catch (er) {
            console.log("%cTuftsCEEO ", "color: #3ba336;", er);
            //await port.close();
        }

        if (port.readable) {
            return true;
        }
        else {
            return false;
        }
    }

    // Reads Data from the SPIKE Prime (Uint8Array Format)
    async function readPort() {
        // eslint-disable-next-line no-undef
        let decoder = new TextDecoderStream();

        let inputDone = port.readable.pipeTo(decoder.writable);
        const inputStream = decoder.readable;

        reader = inputStream.getReader();
        lockedReader = true;
        while (port.readable && lockedReader) {
            //const reader = port.readable.getReader();
            try {
                while (true) {
                    const { value, done } = await reader.read();
                    if (done) {
                        console.log("done!")
                        break;
                    }
                    props.exportConsole(value);
                }
            } catch (error) {
                console.error(error);
            } finally {
                //reader.releaseLock();
            }
        }
    }

    function initWriteStream() {
        // eslint-disable-next-line no-undef
        textEncoder = new TextEncoderStream();
        writableStreamClosed = textEncoder.readable.pipeTo(port.writable);
        writer = textEncoder.writable.getWriter();
    }

    

    // Writes a string (or array of strings) to the SPIKE terminal
    async function writeToPort(lines) {
        if (!isWriteInit) {
            try {
                initWriteStream()
                isWriteInit = true;
            }
            catch (e) {
                console.error("Unable to initialize stream")
            }
        }

        if (writer === undefined) {
            console.error("Error: Writer Not Defined");
        }
        else {
            console.log("----------------WRITING TO MICROPROCESSOR----------------")
            console.log(lines)
            if (typeof(lines) === "string")
                await writer.write(lines);
            // Writes code one line at a time
            else if(typeof(lines) === "object") {
                lines.forEach(async (element) => {
                    if (!stopCode) {
                        await writer.write(element);
                    }
                });
            }

            if (stopCode) {
                setStopCode(false);
            }

            console.log("----------------FINISHED WRITING----------------")

        }
        
    }

    // CTRL + C to enter REPL and starts reading from port
    async function startWebSerial() {
        if (await initWebSerial()) {
            await writeToPort([CONTROL_C]);
            setTimeout(async() => {
                readPort()
            }, 250);
        }
    }

    async function unlockStreams() {
        reader.cancel();
        //writer.releaseLock();
        reader.closed.then(() => {
            lockedReader = false;
        });
        /*
        writer.closed.then(() => {
            isWriteInit = false;
        });
        */
       isWriteInit = false;
        
    }

    // Unlocks streams and then closes the serial port
    async function closePort() {
        unlockStreams();
        let interval = setInterval(() => {
            if (!(lockedReader || isWriteInit)) {
                port.close();
                setSerialOn(false);
                setConnectText(defaultDirections);
                

                isWriteInit = false;
                textEncoder = undefined;
                writableStreamClosed = undefined;

                reader = undefined;
                writer = undefined;
                lockedReader = false;
                clearInterval(interval);
            }
        }, 100);

    }
    
    // Serial Port UI Component Hooks
    const defaultDirections = "Device Not Connected, Connect Here: ";
    const activeSerialDirections = ""
    const [connectText, setConnectText] = useState(defaultDirections);
    const [serialOn, setSerialOn] = useState(false);
   

    // Changes functionality of serial port button once serial port is connected
    function serialButtonConnected() {
        setSerialOn(true);
        setConnectText(activeSerialDirections);
        port.addEventListener('disconnect', event => {
            setSerialOn(false);
            setConnectText(defaultDirections)
        });
        
    }

    // Attempts a WebSerial Connection (associated with button press)
    async function connectToSPIKE() {
        await startWebSerial(); 
        serialButtonConnected();
    }

    function runCurrentCode() {
        let currentCode = props.getCurrentCode()

        if (!currentCode.includes("\n")) {
            writeToPort(currentCode + "\r\n");
            return;
        }

        // Old code removed

        // Newer code to create a python file and run
        //currentCode = currentCode.replace('\r', '')

        writeToPort(CONTROL_E)
        writeToPort(currentCode);
        writeToPort(CONTROL_D)
    }

    // Removes all comments from code before parsing
    // Includes #, ''', and empty line comments
    function stripComments(codeArray) {
        let blockCommentMode = false;
        return codeArray.filter((line) => {
            if (line.length === 0 || line.trim().charAt(0) === "#") {
                return false;
            }
            if (line.length >= 3 && line.includes("'''")) {
                if (blockCommentMode) {
                    blockCommentMode = false;
                } 
                else {
                    blockCommentMode = true;
                }
                return false;
            }
            if (blockCommentMode) {
                return false;
            }
            return true;
        })

    }


    // Saves code in current editor to the SPIKE Prime as a file
    function uploadCurrentCode() {
        const code = props.getCurrentCode();
        const fileName = props.getCurrentFileName();
        writeToPort([CONTROL_C, CONTROL_E, 'code = """' + code + '"""\n', 'f = open("' + fileName + '", "w")\n', 'f.write(code)\n', 'f.close()\n', CONTROL_D])

    }

    function runCurrentFile() {
        const fileName = props.getCurrentFileName();
        writeToPort(["f = open('" + fileName + "')\r\n", "exec(f.read())\r\n", "f.close()\r\n"])
    }

    function writeAndRunCode() {
        uploadCurrentCode();
        runCurrentFile();
    }

    function downloadTxtFile() {
        const element = document.createElement("a");
        const file = new Blob([props.getCurrentCode()], {
          type: "text/plain"
        });
        element.href = URL.createObjectURL(file);
        element.download = props.getCurrentFileName();
        document.body.appendChild(element);
        element.click();
    }

    function deleteFile(filePath) {
        
    }

    // When CRTL + ENTER is pressed, code is run
    // https://stackoverflow.com/questions/37440408/how-to-detect-esc-key-press-in-react-and-how-to-handle-it
    
    useEffect(() => {
        const handleEsc = (event) => {
            if (event.shiftKey && event.key === "Enter"){
                event.preventDefault();
                writeToPort(CONTROL_E)
                writeToPort(props.getCurrentCode());
                writeToPort(CONTROL_D);
            } 

            else if (event.key === "Enter") {
                setTimeout(() => {
                    if (props.newREPLEntry) {
                        props.setNewREPLEntry(false);
                        writeToPort(props.consoleInput);
                        writeToPort(ENTER);
                        props.setConsoleInput("")
                    }
                }, 10);
            }

            else if (event.key === "Tab") {
                setTimeout(() => {
                    if (props.newREPLEntry) {
                        props.setNewREPLEntry(false);
                        writeToPort(TAB);
                        console.log(props.consoleInput);
                        props.setConsoleInput("")
                    }
                }, 10);
            }
                
        };
        window.addEventListener('keydown', handleEsc);

        return () => {
            window.removeEventListener('keydown', handleEsc);
        };
    }, [props]);
    

    return (
        <div className="flex justify-center">
            
            <SerialButton 
                on={serialOn} 
                offColor="error"
                onColor="success" 
                connectText={connectText} 
                
                onClick={() => {
                    connectToSPIKE();
                }} 
                restartClick={closePort} 
                getCurrentCode={props.getCurrentCode}
                runCurrentCode={writeToPort}
            />
            

            <div className={!serialOn ? "hidden" : "mx-4"}>
                <Tooltip title="Restart Device" placement="top">
                    <Fab 
                        onClick={async () => {
                            await writeToPort(CONTROL_D);
                            setTimeout(() => {
                                writeToPort(CONTROL_C);
                            }, 1000);
                        }} 
                        color="warning" 
                        aria-label="add" 
                        size="small">

                        <RestartAltIcon />
                    </Fab>
                </Tooltip>
            </div>

            {/* RUN BUTTON Displayed when SPIKE IS connected */}
            <div className={!serialOn ? "hidden" : "mx-4"}>
                <Tooltip title="Run Current File" placement="top">
                    <Fab 
                        onClick={runCurrentCode} 
                        color="info" 
                        aria-label="add" 
                        size="small">

                        <PlayCircleIcon />
                    </Fab>
                </Tooltip>
            </div>

            

            <div className={!serialOn ? "hidden" : "mr-4"}>
                <Tooltip title="Stop" placement="top">
                    <Fab 
                        onClick={() => {
                            setStopCode(true);
                            writeToPort([CONTROL_C])
                        }} 
                        color="error" 
                        aria-label="add" 
                        size="small">

                        <StopCircleIcon />
                    </Fab>
                </Tooltip>
            </div>

            <SidebarMenu 
                className={!serialOn ? "hidden" : "mx-2"}
                uploadCode={() => {uploadCurrentCode()}}
                runCurrentCode={() => {runCurrentFile()}}
                writeAndRunCode={() => {writeAndRunCode()}}
                currentCode={() => {
                    return props.getCurrentCode()
                }}
                downloadTxtFile={() => downloadTxtFile()}
                clearConsole={props.clearConsole}
                writeToPort={writeToPort}
            />



            
            <APIButton link={docsLink} className={"mx-4"} color={"inherit"} />
        </div>
        
    )
}

export default Serial;