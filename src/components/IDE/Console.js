import React, {useRef, useEffect} from "react";

function Console(props) {

    

    const scrollRef = useRef(null);

    useEffect(() => {
        scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    });

    return (
        <div className="border border-black overflow-scroll h-full max-h-96 bg-white">
            <p 
            className="text-decoration-line: underline text-center">
                    Console
            </p>
            <br />
            {(props.content.split('\n')).map((element, index) => {
                return (
                <div ref={scrollRef} key={index}>
                    <p>{element}</p>
                </div>)
            })}
        
        </div>
    )
}

export default Console;