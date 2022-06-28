import React, {useState, useEffect} from "react";
import SerialButton from "./SerialButton";
import APIButton from "./APIButton";
import Tooltip from "@mui/material/Tooltip";
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import StopCircleIcon from '@mui/icons-material/StopCircle';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import Fab from '@mui/material/Fab';


const VENDOR_ID = 0x0694; // LEGO SPIKE Prime Hub

let port = null;

const CONTROL_A = '\x01'; // CTRL-A character 
const CONTROL_B = '\x02'; // CTRL-B character
const CONTROL_C = '\x03'; // CTRL-C character 
const CONTROL_D = '\x04'; // CTRL-D character
const CONTROL_E = '\x05'; // CTRL-E character
const CONTROL_F = '\x06'; // CTRL-F character
const ENTER = '\r\n' // NEWLINE character

const docsLink = "https://tufts-cr-for-lego.codingrooms.com/documentation/spike_prime_python_knowledge_base#top";

let isWriteInit = false;
let textEncoder;
let writableStreamClosed;

let writer;


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

    const [readSerialPort, setReadSerialPort] = useState(true);

    // Reads Data from the SPIKE Prime (Uint8Array Format)
    async function readPort() {
        // eslint-disable-next-line no-undef
        let decoder = new TextDecoderStream();
        let inputDone = port.readable.pipeTo(decoder.writable);
        const inputStream = decoder.readable;

        const reader = inputStream.getReader();
        while (port.readable && readSerialPort) {
            //const reader = port.readable.getReader();
            try {
                while (true) {
                const { value, done } = await reader.read();
                if (done) {
                    // |reader| has been canceled.
                    break;
                }
                props.exportConsole(value);
                }
            } catch (error) {
                console.error(error);
            } finally {
                reader.releaseLock();
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
            await writer.write(ENTER)

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
            writer.write(ENTER)

            if (stopCode) {
                setStopCode(false);
            }

        }
        
    }

    // Writes and reads code to/from serial port
    async function startWebSerial() {
        if (await initWebSerial()) {
            await writeToPort([CONTROL_C]);

            setTimeout(async() => {
                readPort()
            }, 250);
        }

    }

    function closePort() {
        port.close()
    }
    
    // Serial Port UI Component Hooks
    const defaultDirections = "SPIKE Not Connected, Connect Here: ";
    const activeSerialDirections = ""
    const [connectText, setConnectText] = useState(defaultDirections);
    const [serialOn, setSerialOn] = useState(false);
   

    // Changes functionality of serial port button once serial port is connected
    function serialButtonConnected() {
        let checkConnectionInterval;
        setTimeout(() => {
            checkConnectionInterval = setInterval(() => {
                if (port.readable) {
                    setSerialOn(true);
                    setConnectText(activeSerialDirections);
                }
                else if (port === null || port === undefined ||  !port.readable) {
                    //clearInterval(checkConnectionInterval);
                    setSerialOn(false);
                    setConnectText(defaultDirections)

                }
                
            }, 1000);
        }, 500);
        
    }

    // Attempts a WebSerial Connection (associated with button press)
    function connectToSPIKE() {
        startWebSerial(); 
        serialButtonConnected();
    }

    function runCurrentCode() {
        console.log("RUNNING!")

        // Adds appropriate spaces at end of code to
        // make sure the Python interpreter knows to run
        // the code.
        let currentCode = props.getCurrentCode();
        // Windows adds an extra \r along with \n
        let codeArray = currentCode.split("\n");
        
        codeArray = stripComments(codeArray);
        console.log(codeArray);

        let indentedCodeArray = [];
        for (let i = 0; i < codeArray.length; i++) {
            let codeBlockObj = processCodeLine(codeArray, i);

            i = codeBlockObj.newLineNumber;
            let blockToWrite = codeBlockObj.codeBlock;
            console.log(blockToWrite);

            // If code has indent, enter paste mode and insert block using
            // CTRL-E and CRTL-D
            if (blockToWrite.length > 1) {
                indentedCodeArray.push(...blockToWrite);
                indentedCodeArray.push("\r\n");
            }
            else {
                indentedCodeArray.push(...blockToWrite);
                indentedCodeArray.push("\r\n");
            }
            
        }
        writeToPort([...indentedCodeArray]);
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

    // Processes a block of code for interpretation by SPIKE
    // If single line, it's simply written to the SPIKE REPL
    // If it's a block (if, for, def), it's copy-pasted using paste mode
    function processCodeLine(codeArray, lineNum) {
        let curElement = codeArray[lineNum];
        curElement = curElement.replace("\r", "");
        curElement = curElement.replace("\t", "    ");

        let blockToWrite = [curElement];
        
        // Detect if code block is ahead, enters block mode and saves
        // the block as one string
        if (curElement.trim().charAt(curElement.length - 1) === ":") {
            lineNum++;

            blockToWrite.unshift(CONTROL_E);
            blockToWrite.push("\r\n");

            while (lineNum < codeArray.length && 
            (codeArray[lineNum].length === 0 ||
            codeArray[lineNum].substring(0,4) === "    "))
            {
                blockToWrite.push(codeArray[lineNum]);
                blockToWrite.push("\r\n")
                lineNum++;
            }
            blockToWrite.push(CONTROL_D)
        }

        // Add a newline back into code to seperate colon statement from
        // indented block
        
        return ({
            codeBlock: blockToWrite,
            newLineNumber: lineNum
        });
    }

    // When CRTL + ENTER is pressed, code is run
    // https://stackoverflow.com/questions/37440408/how-to-detect-esc-key-press-in-react-and-how-to-handle-it
    
    useEffect(() => {
        const handleEsc = (event) => {
            if (event.keyCode === 13 && event.ctrlKey) 
                runCurrentCode();
        };
        window.addEventListener('keydown', handleEsc);

        return () => {
            window.removeEventListener('keydown', handleEsc);
        };
    }, []);
    

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
                <Tooltip title="Restart SPIKE" placement="top">
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

            <APIButton link={docsLink} on={serialOn} color={"inherit"} />

            

        </div>
    )
}

export default Serial;
