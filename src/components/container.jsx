import React, { useState } from 'react';
import '../stylesheets/app.scss';
import App from './app';
import Intro from './intro';

const Navbar = () => {
    return (
        <div id="nav">
            <h3>I'm the navbar</h3>
        </div>
    )
}

const Container = () => {
    const [showIntro, hideIntro] = useState(true);
    
    let intro = !showIntro ? "" : <div id="intro-wrapper" onClick={() => hideIntro(false)}><Intro /></div>;
    return (
        <div id="container">
            {intro}
            <App />
        </div>
        
    )
}

export default Container;