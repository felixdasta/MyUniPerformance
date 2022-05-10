import React from "react";
import { StyleRoot } from 'radium';

export default function Home() {
    
    const style = {
            width: '100%',
            height: 4600,
            overflowY: "hidden",
            '@media only screen and (max-width: 500px)': {
                height: 5000
            },
            '@media only screen and (max-width: 450px)': {
                height: 5100
            },
            '@media only screen and (max-width: 400px)': {
                height: 5250
            }
        
    }

    return (
        <StyleRoot>
            <iframe style={style} src="https://araigumedra.github.io/MyUniPerformance.github.io/"  type="text/html"/>
        </StyleRoot>
       
    );
}
