import { EventEmitter } from 'events';
import AppDispatcher from '../dispatcher/app-dispatcher';
import MazeGenerator from '../maze/mazeGenerator';
import WalkerManager from '../walker/walker';
import MazePathController from '../controller/mazeController';

// We've named this object MazeStore but it will really deal with other things such as scripts too
// In this case, it doesn't make a lot of sense to break apart into 2 stores
let mazeConfig = {
    pathWidth: 20,
    wall: 4,
    outerWall: 4,
    width: 10,
    height: 10,
    wallColor: '#d24',
    pathColor: '#222a33',
    maze: [],
    test: "oldState"
}
mazeConfig.canvasWidth = mazeConfig.outerWall * 2 + (mazeConfig.width * (mazeConfig.pathWidth + mazeConfig.wall)) - mazeConfig.wall;
mazeConfig.canvasHeight = mazeConfig.outerWall * 2 + (mazeConfig.height * (mazeConfig.pathWidth + mazeConfig.wall)) - mazeConfig.wall;
mazeConfig.offset = mazeConfig.pathWidth/2 + mazeConfig.outerWall;

let maze = [],
    defaultCellSelectionMethod = 'newest',
    steps = 0,
    mazeCtx = null,
    pathCtx = null;

const MazeStore = Object.assign({}, EventEmitter.prototype, {

    // This can be refactored and most likely consolidated into just 3 methods
    emitChange: function() {
        this.emit('change');
    },
    addChangeListener: function(callback) {
        this.on('change', callback);
    },
    removeChangeListener: function(callback) {
        this.removeListener('change', callback);
    },
    emitSpriteEvent: function(spriteLabel) {
        this.emit(spriteLabel);
    },
    addSpriteEventListener: function(spriteLabel, callback) {
        this.on(spriteLabel, callback);
    },
    removeSpriteEventListener: function(spriteLabel, callback) {
        this.removeListener(spriteLabel, callback);
    },
    generateInitialMaze: function(context) {
        mazeCtx = context;
        MazeStore.emitSpriteEvent('sorcerer');
        maze = MazeGenerator.initialize(mazeCtx, defaultCellSelectionMethod, mazeConfig);
        mazeConfig.maze = maze;
        MazeStore.emitChange();
    },
    savePathContext: function(context) {
        pathCtx = context;
        WalkerManager.initialize(pathCtx, mazeConfig);
        MazePathController.initialize(pathCtx, WalkerManager, mazeConfig);
    },
    getMazeConfig: function() {
        return mazeConfig;
    },
    getSteps: function() {
        return steps;
    },
    updateSteps: function() {
        steps++;
    },
    resetSteps: function() {
        steps = 0;
    },
    _redrawMaze: function(cellSelectionMethod) {
        MazePathController.clearTimeout();                    
        MazePathController.clearCanvas(); 
        maze = MazeGenerator.redrawMaze(cellSelectionMethod);
        mazeConfig.maze = maze;
        WalkerManager.updateConfig(mazeConfig);
        MazeStore.emitSpriteEvent('sorcerer');
        MazeStore.emitSpriteEvent('alaska--maze-generated');
        MazeStore.emitChange(); // to provide mazeConfig to mazeLayer
    },
    _runSolverScript: function(scriptName) {
        // Stop any currently running scripts
        // Clear the pathCtx
        // Initialize the Controller (for any potential changes to mazeConfig)
        // Locate the script and run it
        MazePathController.clearTimeout();    
        MazePathController.clearCanvas();
        MazePathController.initialize(pathCtx, WalkerManager, mazeConfig); // re-initialize for any potential mazeConfig changes

        // Formatting the script path here instead of in a new method because of webpack
        // https://github.com/webpack/webpack/issues/6680
        import("../scripts/algos/" + scriptName + ".js").then((script) => {
            MazePathController.initializeScript(script.default);
            MazePathController.run();
        });
    }
});

MazeStore.dispatchToken = AppDispatcher.register(function (action) {
    switch (action.actionType) {
        case "UPDATE_CELL_SELECTION_METHOD":
            // Stop any scripts from running, clear pathLayer, redraw maze
            MazeStore._redrawMaze(action.data);
            break;
        case "RUN_SOLVER_SCRIPT":
            // Stop any scripts from running, clear pathLayer
            MazeStore._runSolverScript(action.scriptName);
            break;
        default:
    };
});


export default MazeStore;