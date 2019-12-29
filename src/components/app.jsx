import React from 'react';
import Sorcerer from './sprites/sorcerer';
import Maze from './maze';
import SelectorModules from './selector/selector_modules';
import Alaska from '../components/sprites/alaska';
import StepsDisplay from '../components/steps-display';


const App = () => {
    return (
        <div id="app">
            <SelectorModules />
            <Alaska />
            <Sorcerer />
            <StepsDisplay />
            <Maze />
        </div>
    );
};

export default App;