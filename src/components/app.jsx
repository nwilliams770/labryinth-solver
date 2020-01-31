import React from 'react';
import Sorcerer from './sprites/sorcerer';
import Maze from './maze';
import SelectorModules from './selector/selector_modules';
import Alaska from './sprites/alaska';
import StepsDisplay from './steps-display';
import WallDestroyButtons from './buttons/wall_destroy_buttons';
import Footer from './footer/footer';


const App = () => {
    return (
        <div id="app">
            <WallDestroyButtons />
            <SelectorModules />
            <Alaska />
            <Sorcerer />
            <StepsDisplay />
            <Maze />
            <Footer />
        </div>
    );
};

export default App;