import React from 'react';
import Sorcerer from './sprites/sorcerer';
import Maze from './maze/maze';
import SelectorModules from './selector/selector_modules';

const App = () => {
    return (
        <div id="app">
            <SelectorModules />
            <Sorcerer />
            <Maze />
        </div>
    );
};

export default App;