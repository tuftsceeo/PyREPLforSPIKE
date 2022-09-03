export default function getScript(hubName){
    const scriptLines = `import os, sound

ROOT = "/flash"

# Default Files
README_TXT_CODE = """This is a MicroPython board
You can get started right away by writing your Python code in 'main.py'.
For a serial prompt:
- Windows: you need to go to 'Device manager', right click on the unknown device,
then update the driver software, using the 'pybcdc.inf' file found on this drive.
Then use a terminal program like Hyperterminal or putty.
- Mac OS X: use the command: screen /dev/tty.usbmodem*
- Linux: use the command: screen /dev/ttyACM0
Please visit http://micropython.org/help/ for further help.
"""

README_TXT = {
    "name": "README.txt",
    "code": README_TXT_CODE
}

BOOT_PY_CODE = """# boot.py -- run on boot to configure USB and filesystem
# Put app code in main.py
import hub
hub.config["enable_hub_os"] = True
"""

BOOT_PY = {
    "name": "boot.py",
    "code": BOOT_PY_CODE
}

MAIN_PY = {
    "name": "main.py",
    "code": "# main.py -- Put your own code here!"
}

HEART_PY_CODE = """import array, button, color_sensor, force_sensor, distance_sensor, time, motor, port, sound, display, math, util, rgb

display.display_clear()

sound.beepPlay(500, 125)
time.sleep_ms(125)
sound.beepPlay(750, 125)

# Map of Button integer keys to string descriptions
btn = {
    0:'power',
    1:'left',
    2:'right',
    3:'connect',
}

# Map of Device Types
devices = {
    "mediumMotor": 48,
    "largeMotor": 49,
    "colorSensor": 61,
    "distanceSensor": 62,
    "forceSensor": 63,
    "noDevice": 255
}

# Global variables
ports = [port.PORTA, port.PORTB, port.PORTC, port.PORTD, port.PORTE, port.PORTF]
currentPower = 0
MIN_THRESHOLD = 3000 # minimum value to power motors (30%)
MAX_THRESHOLD = 10000 # max power to motors

NUMBER_OF_PORTS = 6

CENTER_BUTTON = 0
LEFT_BUTTON = 1
RIGHT_BUTTON = 2

CONNECTION_ON = 100
CONNECTION_OFF = 50

MAX_DISTANCE = 200

def portIsDevice(portInput, device):
    return (port.port_getDevice(portInput) == devices[device])

def isMotor(portInput):
    return (portIsDevice(portInput, "mediumMotor") or portIsDevice(portInput, "largeMotor"))
    
def isSensor(portInput):
    return (portIsDevice(portInput, "colorSensor") or portIsDevice(portInput, "distanceSensor") or portIsDevice(portInput, "forceSensor"))

def getAcrossPort(portInput):
    if (portInput % 2 == 1):
        return (portInput - 1)
    return (portInput + 1)

# Returns True if the device across from a port is a sensor
def acrossIsSensor(portInput):
    return (isSensor(getAcrossPort(portInput)))
    
# Translate sensor value to motor power
def getSensorScaledValue(portInput):
    sensorPort = portInput
    if (portIsDevice(sensorPort, "colorSensor")):
        return int(color_sensor.get_reflection(portInput) / 100 * MAX_THRESHOLD)
    elif (portIsDevice(sensorPort, "forceSensor")):
        return int(force_sensor.get_force(portInput) / 100 * MAX_THRESHOLD)
    elif (portIsDevice(sensorPort, "distanceSensor")):
        if (distance_sensor.get_distance(portInput) == None or distance_sensor.get_distance(portInput) > MAX_DISTANCE):
            return 0
        return int((MAX_DISTANCE - distance_sensor.get_distance(portInput))/MAX_DISTANCE  * MAX_THRESHOLD)
        
    return 0
    
# Changes the power sent to all single motor ports by a given value
def changePortPower(value):
    global ports, currentPower
    currentPower = adjustPowerLevel(value)
    for i in range(len(ports)):
        if (isMotor(i) and (not acrossIsSensor(i))):
            port.port_setPower(ports[i], currentPower + (currentPower * -2 * (i%2)))
        
# Logic for power level adjustment
def adjustPowerLevel(value):
    global currentPower
    
    if (abs(currentPower + value) > MAX_THRESHOLD):
        return currentPower
    
    # Zero power if going below the threshold value
    if (abs(currentPower + value) < MIN_THRESHOLD and abs(currentPower) >= MIN_THRESHOLD):
        return 0
    
    # Set to threshold value if coming from below the threshold
    if (abs(currentPower) < MIN_THRESHOLD):
        print(currentPower)
        if (value > 0):
            return MIN_THRESHOLD
        return -MIN_THRESHOLD
    
    return currentPower + value
    
    
# Sets power to motors connected across from sensors
def setSensorPowerConnections():
    global ports
    for p in ports:
        if (isSensor(getAcrossPort(p))):
            port.port_setPower(p, getSensorScaledValue(getAcrossPort(p)))
        
# Turns off power to all ports
def zeroPortPower():
    global ports, currentPower
    currentPower = 0
    for i in ports:
        port.port_setPower(i, 0)
        

# Displays all active connections on the hub
def displayConnections():
    for i in range(len(ports)):
        if (i%2 == 0):
            if (port.port_getDevice(i) != devices["noDevice"]):
                display.display_set_pixel(0, math.floor(i), CONNECTION_ON)
                display.display_set_pixel(1, math.floor(i), CONNECTION_ON)
            else:
                display.display_set_pixel(0, math.floor(i), CONNECTION_OFF)
                display.display_set_pixel(1, math.floor(i), CONNECTION_OFF)
        else:
            if (port.port_getDevice(i) != devices["noDevice"]):
                display.display_set_pixel(3, i-1, CONNECTION_ON)
                display.display_set_pixel(4, i-1, CONNECTION_ON)
            else:
                display.display_set_pixel(3, i-1, CONNECTION_OFF)
                display.display_set_pixel(4, i-1, CONNECTION_OFF)
                

                
def setButtonColor(color):
    rgb.rgb_setColor(rgb.RGB_BUTTON_RIGHT, color)
    rgb.rgb_setColor(rgb.RGB_BUTTON_LEFT, color)

leftPressed, rightPressed = False, False
increment = 1000
delay = 0.05

# Main function to detect user input
async def main():
    setButtonColor(rgb.LEGO_PURPLE)

    # Check if center button is pressed, exit if pressed
    while (button.button_isPressed(CENTER_BUTTON)[0] == 0):
        
        displayConnections()
        
        setSensorPowerConnections()
        
        # Check for new button presses, execute motor speed adjustment
        if (button.button_isPressed(LEFT_BUTTON)[0] == 0):
            leftPressed = False
        elif (not leftPressed):
            leftPressed = True
            changePortPower(-increment)
            print(currentPower)
            
        if (button.button_isPressed(RIGHT_BUTTON)[0] == 0):
            rightPressed = False
        elif (not rightPressed):
            rightPressed = True
            changePortPower(increment)
            print(currentPower)
            
        time.sleep(delay)
        
        
    # Boxed code below is skipped when in slot mode, only for REPL mode
    # ---------------------------------
        
    zeroPortPower()
        
    sound.beepPlay(750, 125)
    time.sleep_ms(100)
    sound.beepPlay(500, 125)
    
    setButtonColor(rgb.LEGO_GREEN)
    
    display.display_clear()
    
    # ---------------------------------

util.run(main())"""


HEART_PY = {
    "name": "heart.py",
    "code": HEART_PY_CODE
}


MYSTERY_PY_CODE = """import sound, time
BEAT = 529 # ms per beat
notes = {
    "C": 524,
    "C#": 554,
    "D": 587,
    "D#": 622,
    "E": 659,
    "F": 698,
    "F#": 740,
    "G": 784,
    "G#": 831,
    "A": 880,
    "A#": 932,
    "B": 988,
    "C2": 1047,
    "C2#": 1109,
    "D2": 1175,
}
def playNote(frequency, length):
    sound.beepPlay(frequency, (length))
    time.sleep_ms(length)
    
def rest(length):
    time.sleep_ms(round(length))
def intro():
    global BEAT, notes
    
    # Bar 1
    playNote(notes["G"], round(BEAT*1.5))
    playNote(notes["A"], round(BEAT*1.5))
    playNote(notes["D"], (BEAT))
    
    # Bar 2
    playNote(notes["A"], round(BEAT*1.5))
    playNote(notes["B"], round(BEAT*1.5))
    playNote(notes["D2"], round(BEAT*0.25))
    playNote(notes["C2"], round(BEAT*0.25))
    playNote(notes["B"], round(BEAT*0.5))
    
    # Bar 3
    playNote(notes["G"], round(BEAT*1.5))
    playNote(notes["A"], round(BEAT*1.5))
    playNote(notes["D"], round(BEAT*2.5)) # continues to next bar
    
    # Bar 4
    rest(BEAT)
    playNote(notes["D"], round(BEAT*0.25))
    playNote(notes["D"], round(BEAT*0.25))
    playNote(notes["E"], round(BEAT*0.25))
    playNote(notes["G"], round(BEAT*0.5))
    playNote(notes["G"], round(BEAT*0.25))
    
    
def body1():
    global BEAT, notes
    
    # Bar 5
    rest(BEAT)
    playNote(notes["E"], round(BEAT*0.5))
    playNote(notes["F#"], round(BEAT*0.5))
    playNote(notes["G"], round(BEAT*0.5))
    playNote(notes["G"], round(BEAT*0.5))
    playNote(notes["A"], round(BEAT*0.5))
    playNote(notes["F#"], round(BEAT*0.75))
    
    # Bar 6
    playNote(notes["E"], round(BEAT*0.25))
    #playNote(notes["D"], round(BEAT*0.5))
    playNote(notes["D"], round(BEAT*2.5))
    rest(BEAT)
    
    # Bar 7
    rest(BEAT*0.5)
    playNote(notes["E"], round(BEAT*0.5))
    playNote(notes["E"], round(BEAT*0.5))
    playNote(notes["F#"], round(BEAT*0.5))
    playNote(notes["G"], round(BEAT*0.5))
    playNote(notes["E"], round(BEAT))
    playNote(notes["D"], round(BEAT *0.5))
    
    # Bar 8
    playNote(notes["D2"], round(BEAT *0.5))
    rest(BEAT*0.5)
    playNote(notes["D2"], round(BEAT *0.5))
    playNote(notes["A"], round(BEAT *1.5))
    rest(BEAT)
    
    # Bar 9
    playNote(notes["E"], round(BEAT*0.5))
    playNote(notes["E"], round(BEAT*0.5))
    playNote(notes["F#"], round(BEAT*0.5))
    playNote(notes["G"], round(BEAT*0.5))
    playNote(notes["E"], round(BEAT*0.5))
    playNote(notes["F#"], round(BEAT*0.5))
    playNote(notes["G"], round(BEAT*0.5))
    rest(BEAT*0.5)
    
    # Bar 10
    playNote(notes["F#"], round(BEAT*0.5))
    playNote(notes["E"], round(BEAT*0.5))
    playNote(notes["D"], round(BEAT*1.5))
    rest(BEAT *0.5)
        
    
    # Bar 11
    rest(BEAT *0.5)
    playNote(notes["E"], round(BEAT*0.5))
    playNote(notes["E"], round(BEAT*0.5))
    playNote(notes["F#"], round(BEAT*0.5))
    playNote(notes["G"], round(BEAT*0.5))
    playNote(notes["E"], round(BEAT*0.5))
    playNote(notes["D"], round(BEAT))
    
    # Bar 12
    playNote(notes["A"], round(BEAT*0.5))
    playNote(notes["A"], round(BEAT*0.5))
    playNote(notes["A"], round(BEAT*0.5))
    playNote(notes["B"], round(BEAT*0.5))
    playNote(notes["A"], round(BEAT))
    rest(BEAT)
    
    # Bar 13
    playNote(notes["G"], round(BEAT*2.5))
    playNote(notes["A"], round(BEAT*0.5))
    playNote(notes["B"], round(BEAT*0.5))
    playNote(notes["G"], round(BEAT*0.5))
    
    # Bar 14
    playNote(notes["A"], round(BEAT*0.5))
    playNote(notes["A"], round(BEAT*0.5))
    playNote(notes["A"], round(BEAT*0.5))
    playNote(notes["B"], round(BEAT*0.5))
    playNote(notes["A"], round(BEAT))
    playNote(notes["D"], round(BEAT))
    
    # Bar 15
    rest(BEAT * 2)
    playNote(notes["E"], round(BEAT*0.5))
    playNote(notes["F#"], round(BEAT*0.5))
    playNote(notes["G"], round(BEAT*0.5))
    playNote(notes["E"], round(BEAT*0.5))
    
    # Bar 16
    rest(BEAT * 0.5)
    playNote(notes["A"], round(BEAT*0.5))
    playNote(notes["B"], round(BEAT*0.5))
    playNote(notes["A"], round(BEAT*1.5))
    
    
def body2():
    global notes, BEAT
    
    # Bar 16
    playNote(notes["D"], round(BEAT*0.25))
    playNote(notes["E"], round(BEAT*0.25))
    playNote(notes["G"], round(BEAT*0.25))
    playNote(notes["E"], round(BEAT*0.25))
    
    # Bar 17
    playNote(notes["B"], round(BEAT*0.75))
    playNote(notes["B"], round(BEAT*0.75))
    playNote(notes["A"], round(BEAT*1.5))
    playNote(notes["D"], round(BEAT*0.25))
    playNote(notes["E"], round(BEAT*0.25))
    playNote(notes["G"], round(BEAT*0.25))
    playNote(notes["E"], round(BEAT*0.25))
    
    # Bar 18
    playNote(notes["A"], round(BEAT*0.75))
    playNote(notes["A"], round(BEAT*0.75))
    playNote(notes["G"], round(BEAT*0.75))
    playNote(notes["F#"], round(BEAT*0.25))
    playNote(notes["E"], round(BEAT*0.5))
    playNote(notes["D"], round(BEAT*0.25))
    playNote(notes["E"], round(BEAT*0.25))
    playNote(notes["G"], round(BEAT*0.25))
    playNote(notes["E"], round(BEAT*0.25))
    
    # Bar 19
    playNote(notes["G"], round(BEAT))
    playNote(notes["A"], round(BEAT*0.5))
    playNote(notes["F#"], round(BEAT*0.75))
    playNote(notes["E"], round(BEAT*0.25))
    playNote(notes["D"], round(BEAT*0.5))
    playNote(notes["D"], round(BEAT*0.5))
    playNote(notes["D"], round(BEAT*0.5))
    
    # Bar 20
    playNote(notes["A"], round(BEAT))
    playNote(notes["G"], round(BEAT*2))
    playNote(notes["D"], round(BEAT*0.25))
    playNote(notes["E"], round(BEAT*0.25))
    playNote(notes["G"], round(BEAT*0.25))
    playNote(notes["E"], round(BEAT*0.25))
    
    # Bar 21
    playNote(notes["B"], round(BEAT*0.75))
    playNote(notes["B"], round(BEAT*0.75))
    playNote(notes["A"], round(BEAT*1.5))
    playNote(notes["D"], round(BEAT*0.25))
    playNote(notes["E"], round(BEAT*0.25))
    playNote(notes["G"], round(BEAT*0.25))
    playNote(notes["E"], round(BEAT*0.25))
    
    # Bar 22
    playNote(notes["D2"], round(BEAT))
    playNote(notes["F#"], round(BEAT*0.5))
    playNote(notes["G"], round(BEAT*0.75))
    playNote(notes["F#"], round(BEAT*0.25))
    playNote(notes["E"], round(BEAT*0.5))
    playNote(notes["D"], round(BEAT*0.25))
    playNote(notes["E"], round(BEAT*0.25))
    playNote(notes["G"], round(BEAT*0.25))
    playNote(notes["E"], round(BEAT*0.25))
    
    # Bar 23
    playNote(notes["G"], round(BEAT))
    playNote(notes["A"], round(BEAT*0.5))
    playNote(notes["F#"], round(BEAT*0.75))
    playNote(notes["E"], round(BEAT*0.25))
    playNote(notes["D"], round(BEAT))
    playNote(notes["D"], round(BEAT*0.5))
    
    # Bar 24
    playNote(notes["A"], round(BEAT))
    playNote(notes["G"], round(BEAT*2))
    rest(BEAT)
    
    
    
def mystery():
    '''
    intro()
    intro()
    '''
    body1()
    body2()
    
    
mystery()"""

MYSTERY_PY = {
    "name": "mystery.py",
    "code": MYSTERY_PY_CODE
}

INIT_FILES = [README_TXT, BOOT_PY, MAIN_PY, HEART_PY, MYSTERY_PY]

# Removes if an object, removes folder if an OS Error occurs
def deleteObject(objectName):
    try:
        os.remove(objectName)
    except OSError:
        deleteFolder(objectName)
    except:
        print("An error occurred: " + objectName)
        
# Deletes all files in a folder and then deletes the folder
def deleteFolder(folderName):
    os.chdir(folderName)
    for file in os.listdir():
        deleteObject(file)
    os.chdir("..")
    os.remove(folderName)
    
# Creates a new file in the current folder
def createFile(fileName, fileContents):
    f = open(fileName, 'w')
    f.write(fileContents)
    f.close()

# Creates a new folder with a hello world program
def createDefaultFolder(folderNumber):
    strFolder = str(folderNumber)
    os.mkdir(strFolder)
    
# Changes the hub name
def changeHubName(name):
    os.chdir(ROOT + "/misc")
    f = open('hubname', 'w')
    f.write(name)
    f.close()
    os.chdir("..")
    
# Adds default files on freshly wiped hub
def addDefaultFiles(files):
    for file in files:
        createFile(file["name"], file["code"])
    
    # Creates hubname file in misc
    os.mkdir('misc')
    os.chdir('misc')
    createFile('hubname', 'SPIKE')
    os.chdir("..")
    
def initSlots(numberOfSlots):
    os.chdir("/flash")
    for i in range(numberOfSlots):
        createDefaultFolder(i)
        
def addHeartProgram(slotNumber):
    slotStr = str(slotNumber)
    os.chdir(slotStr)
    f = open('program.py', 'w')
    f.write('exec(open("' + ROOT + '/heart.py").read())')
    f.close()
    os.chdir("..")
        
        
def setup(hubName):
    # Step 1: Get all files on hub 
    os.chdir(ROOT)
    rootFiles = os.listdir()
    
    # Step 2: Delete all files/folders (wipe file system)
    for path in rootFiles:
        deleteObject(path)
        
    # Step 3: Reload default files onto hub
    addDefaultFiles(INIT_FILES)
    initSlots(10)
    
    # Step 4: Set Hub Name
    changeHubName(hubName)
    
    # Step 5: Load other default Programs
    addHeartProgram(0)
    
    
sound.beepPlay(500, 125)
setup("SPIKE")
changeHubName("${hubName}")
sound.beepPlay(750, 125)`;

    return scriptLines.split("\n")

} 