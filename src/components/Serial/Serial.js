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

const CONTROL_C = '\x03'; // CTRL-C character 
const CONTROL_D = '\x04'; // CTRL-D character
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

        if (writer == undefined) {
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
            await writeToPort(["from spike import PrimeHub, LightMatrix, Button, StatusLight, ForceSensor, MotionSensor, Speaker, ColorSensor, App, DistanceSensor, Motor, MotorPair"])

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

    function strToASCII(s){
        let charCodeArr = [];
        
        for(let i = 0; i < s.length; i++){
            let code = s.charCodeAt(i);
            charCodeArr.push(code);
        }
        
        return charCodeArr;
    }

    function runCurrentCode() {

        // Adds appropriate spaces at end of code to
        // make sure the Python interpreter knows to run
        // the code.
        let currentCode = props.getCurrentCode();
        let codeArray = currentCode.split("\n");
        
        let indentedCodeArray = [];
        for (let i = 0; i < codeArray.length; i++) {
            let curElement = codeArray[i];

            // If there's a colon, check if it's in a string or used for a
            // conditional/loop/function
            let splitByColon = curElement.split(":");
            if (splitByColon.length > 1) {
                curElement = splitByColon[0] + ": \r\n"
            } 
            else {
                curElement += "\r\n";
            }

            let indented = false;
            if (curElement.length >= 4 && curElement.substring(0,4) === "    ") {
                if (i > 0 && codeArray[i-1].length >= 4 && codeArray[i-1].substring(0,4) == "    ") {
                    curElement = curElement.substring(4);
                }
                indented = true;
            }

            indentedCodeArray.push(curElement);

            if (indented) {
                if (i < codeArray.length - 1 && codeArray[i+1].substring(0,4) != "    ") {
                    indentedCodeArray.push("\r\n\r\n\r\n")
                } 
                else if (i >= codeArray.length - 1) {
                    indentedCodeArray.push("\r\n\r\n\r\n")
                }
            }
            
        }
    
        writeToPort([...indentedCodeArray]);
        console.log([...indentedCodeArray]);
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
                            await writeToPort(CONTROL_C);
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
