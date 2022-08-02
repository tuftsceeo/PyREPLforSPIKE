/*
 * ChromeCheck.js
 * By: Gabriel Sessions
 * Last Edit: 8/2/2022
 * 
 * A component to display if, the browser does not support PyREPL
 * 
 */ 

function ChromeCheck(props) {
    return (
        <div className={props.className + " z-20"}>
            <div className="background-white bg-full">
                <h1 className="text-center text-3xl">Your browser is not supported</h1>
                <div className="text-center my-8">
                    <p>Please use a supported browser to acess Web PyREPL!</p>
                    <ul>
                        <li>Google Chrome (89+)</li>
                        <li>Microsoft Edge (89+)</li>
                        <li>Opera (75+)</li>
                    </ul>
                </div>
            </div>
            
        </div>

    )
}

export default ChromeCheck