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
    width: 5,
    height: 5,
    wallColor: '#d24',
    pathColor: '#222a33',
    maze: [],
    test: "oldState"
}
mazeConfig.canvasWidth = mazeConfig.outerWall * 2 + (mazeConfig.width * (mazeConfig.pathWidth + mazeConfig.wall)) - mazeConfig.wall;
mazeConfig.canvasHeight = mazeConfig.outerWall * 2 + (mazeConfig.height * (mazeConfig.pathWidth + mazeConfig.wall)) - mazeConfig.wall;
mazeConfig.start = [1, 1];
mazeConfig.end = [(mazeConfig.height * 2) - 2, (mazeConfig.width * 2) - 2];
mazeConfig.offset = mazeConfig.pathWidth/2 + mazeConfig.outerWall;

let maze = [],
    defaultCellSelectionMethod = 'newest',
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
        WalkerManager.initialize(pathCtx, mazeConfig)
    },
    _clearContext: function(context) {
        context.clearRect(0,0,mazeConfig.canvasWidth, mazeConfig.canvasHeight);
    },
    getMazeConfig: function() {
        return mazeConfig;
    },
    _redrawMaze: function(cellSelectionMethod) {
        this._clearContext(pathCtx);
        maze = MazeGenerator.redrawMaze(cellSelectionMethod)
        mazeConfig.maze = maze
        WalkerManager.updateConfig(mazeConfig);
        MazeStore.emitSpriteEvent('sorcerer');
        MazeStore.emitChange(); // to provide mazeConfig to mazeLayer
    },
    _runSolverScript: function(scriptName) {
        // Clear the path
        // Initialize the walker, and the controller
        // Locate the script and run it
        // MazeGenerator

        // So we could do some logic here like, compare the store's mazeConfig and the MazePathController mazeConfig
        // And have some method that would only UPDATE the config as opposed to initialize every time
        // But object comparison like that seems costly and messy as opposed to just re-initializing?
        MazePathController.initialize(pathCtx, WalkerManager, mazeConfig);
        this._clearContext(pathCtx); // clear the canvas
        
        // Formatting the script path here instead of in a new method because of webpack
        // https://github.com/webpack/webpack/issues/6680
        import("../scripts/algos/" + scriptName + ".js").then((script) => {
            // provides the walker to the script
            MazePathController.initializeScript(script.default);
            // export default all scripts
                MazePathController.run();
        });
        

    }
});

MazeStore.dispatchToken = AppDispatcher.register(function (action) {
    switch (action.actionType) {
        case "UPDATE_CELL_SELECTION_METHOD":
            MazeStore._redrawMaze(action.data);
            break;
        case "RUN_SOLVER_SCRIPT":
            MazeStore._runSolverScript(action.scriptName);
            break;
        default:
    };
});


export default MazeStore;