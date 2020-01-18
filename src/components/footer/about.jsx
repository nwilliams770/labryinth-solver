import React, { useState } from 'react';
import SlidingPanel from 'react-sliding-side-panel';
import trigger from '../../images/about-trigger.gif';

const About = () => {
    const [openPanel, setOpenPanel] = useState(false);

    return (
        <div id="about">
            <div onClick={() => (setOpenPanel(true))} className="trigger">
                <img src={trigger} alt="An animated Mario mystery block. Click to open about sliding drawer."/>
            </div>
            <SlidingPanel
                type={'left'}
                isOpen={openPanel}
                size={35} >
                    <div id="drawer">
                        <h3>Hello!</h3>
                        <button onClick={() => (setOpenPanel(false))}>Hiya!</button>
                    </div>
            </SlidingPanel>
        </div>
    )
};

export default About;