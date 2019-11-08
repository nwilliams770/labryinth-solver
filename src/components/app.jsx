import React from 'react';
import Sorcerer from './sprites/sorcerer';
import Maze from './maze';
import SelectorModules from './selector/selector_modules';
import Alaska from '../components/sprites/alaska';


const App = () => {
    return (
        <div id="app">
            <SelectorModules />
            {/* <Alaska /> */}
            <Sorcerer />
            <Maze />
        </div>
    );
};

export default App;