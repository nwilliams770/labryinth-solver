import { EventEmitter } from 'events';
import AppDispatcher from '../dispatcher/app-dispatcher';
import MazeGenerator from '../scripts/maze/mazeGenerator';

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
    defaultCellSelectionMethod = 'newest';

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

    generateMaze: (ctx) => {
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
        // case "PLACE_TREES":
        //     BoardStore._placeTrees(action.data[0])
        //     break;
        default:
    }
});


export default MazeStore;