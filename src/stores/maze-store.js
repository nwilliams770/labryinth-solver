import { EventEmitter } from 'events';
import AppDispatcher from '../dispatcher/app-dispatcher';
import MazeGenerator from '../scripts/mazeGenerator';

const mazeConfig = {
    pathWidth: 20,
    wall: 4,
    outerWall: 4,
    width: 10,
    height: 10,
    wallColor: '#d24',
    pathColor: '#222a33'
}
mazeConfig.canvasWidth = mazeConfig.outerWall * 2 + (mazeConfig.width * (mazeConfig.pathWidth + mazeConfig.wall)) - mazeConfig.wall;
mazeConfig.canvasHeight = mazeConfig.outerWall * 2 + (mazeConfig.height * (mazeConfig.pathWidth + mazeConfig.wall)) - mazeConfig.wall;

let maze = [],
    defaultCellSelectionMethod = 'newest',
    ctx = null;
    // walkerCtx = null;

const MazeStore = Object.assign({}, EventEmitter.prototype, {
    emitChange: () => {
        this.emit('change');
    },

    addChangeListener: (callback) => {
        this.on('change', callback);
    },

    removeChangeListener: (callback) => {
        this.removeListener('change', callback);
    },

    // Probaby update this to generateInitialMaze
    generateMaze: (context) => {
        ctx = context;
        // this is where we could emit our sprite event
        maze = MazeGenerator.initialize(ctx, defaultCellSelectionMethod, mazeConfig);
        return maze;
    },

    getMaze: () => {
        return maze;
    },

    getMazeConfig: () => {
        return mazeConfig;
    },

    

});

MazeStore.dispatchToken = AppDispatcher.register(function (action) {
    switch (action.actionType) {
        case "UPDATE_MAZE_GENERATION_CONFIG":
                console.log("UPDATING MAZE GENERATION CONFIGURATION");
                console.log("ctx", ctx, "action.data", action.data, "mazeConfig", mazeConfig);
                // this is where we could emit our sprite event
                MazeGenerator.redrawMaze(action.data); // only need to pass new cellSelectionMethod as our generator has already been initializd with the other info
                break;
        default:
    }
});


export default MazeStore;