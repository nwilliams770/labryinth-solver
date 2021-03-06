import React, { useState } from 'react';
import SlidingPanel from 'react-sliding-side-panel';
import trigger from '../../images/about-trigger.gif';
import header from '../../images/alaska-header.png';
import subHeader from '../../images/sub-header.png';
import arrow from '../../images/selector-arrow.png';

const PanelContent = ({ setOpenPanel }) => {
    return (
        <div>
            <div id="drawer-header">
                <button onClick={() => (setOpenPanel(false))}>
                    <img src={arrow} alt="Close sliding drawer"/>
                </button>
                <img id="drawer-title" src={header} alt="Alaska:" />
                <img id="drawer-sub-title" src={subHeader} alt="The Trial of the Maze Wizard" />
                <div class="intro">
                    <p class="copy">
                        Alaska: The Trial of the Maze Wizard is a visual exploration of various
                        maze solving and graph traversal algorithms, in pixelated goodness. <br/>
                        Built with React + HTML5 Canvas.
                    </p>
                </div>
                <a href="https://github.com/nwilliams770/labryinth-solver">See the repo</a>
            </div>
            <div id="drawer-content">
                <div class="item">
                    <div class="title">
                        <h4 class="hdr">Trémaux || Depth-First Search (DFS)</h4>
                    </div>
                    <div class="body">
                        <ul>
                            <li class="point">Visits a given point in the maze at most twice.</li>
                            <li class="point">Not guaranteed to find the shortest path.</li>
                        </ul>
                    </div>
                </div>
                <div class="item">
                    <div class="title">
                        <h4 class="hdr">Wall Follower || Right-Hand Rule</h4>
                    </div>
                    <div class="body">
                        <ul>
                            <li class="point">Cannot always solve multiply-connected mazes.</li>
                            <li class="point">Not guaranteed to find the shortest path.</li>
                        </ul>
                    </div>
                </div>
                <div class="item">
                    <div class="title">
                        <h4 class="hdr">Breadth-First Search (BFS)</h4>
                    </div>
                    <div class="body">
                        <ul>
                            <li class="point">Indifferent to simply- and multiply-connected mazes.</li>
                            <li class="point">Guaranteed to find the shortest path.</li>
                        </ul>
                    </div>
                </div>
                <div class="item">
                    <div class="title">
                        <h4 class="hdr">A<sup>*</sup></h4>
                    </div>
                    <div class="body">
                        <ul>
                            <li class="point">Uses a heuristic that estimates minimum cost from a given location to the goal. This implementation employs Manhattan distance.</li>
                            <li class="point">Guaranteed to find the shortest path.</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}


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
                <PanelContent
                    setOpenPanel={setOpenPanel} />
            </SlidingPanel>
        </div>
    )
};

export default About;