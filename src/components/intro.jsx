import React from 'react';
import Ship from './sprites/ship';
import header from '../images/alaska-header.png';
import subHeader from '../images/sub-header.png';
import copy from '../images/intro-copy.png';

const Intro = () => {
    return (
        <div id="intro">
            <img id="hdr" src={header} alt="Alaska" />
            <img id="sub-hdr" src={subHeader} alt="The Trial of the Maze Wizard" />
            <img id="click-text" className="animate-flicker" src={copy} alt="Click anywhere to start." />
            <Ship/>
        </div>
    );
};

export default Intro;