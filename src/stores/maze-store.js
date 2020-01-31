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
    width: 16,
    height: 16,
    end: 30,
    start: 0,
    wallColor: '#d24',
    pathColor: '#222a33',
    maze: [],
}
mazeConfig.canvasWidth = mazeConfig.outerWall * 2 + (mazeConfig.width * (mazeConfig.pathWidth + mazeConfig.wall)) - mazeConfig.wall;
mazeConfig.canvasHeight = mazeConfig.outerWall * 2 + (mazeConfig.height * (mazeConfig.pathWidth + mazeConfig.wall)) - mazeConfig.wall;
mazeConfig.offset = mazeConfig.pathWidth/2 + mazeConfig.outerWall;

let maze = [],
    defaultCellSelectionMethod = 'newest',
    steps = 0,
    recordedSteps = {},
    currentScript = "",
    mazeCtx = null,
    pathCtx = null;



const MazeStore = Object.assign({}, EventEmitter.prototype, {
// Events-related
    addCustomEventListener: function(eventLabel, callback) {
        this.on(eventLabel, callback);
    },
    removeCustomEventListener: function(eventLabel, callback) {
        this.removeListener(eventLabel, callback);
    },
    emitCustomEvent: function(eventLabel) {
        this.emit(eventLabel);
    },
    saveCanvasContexts: function({pathContext, mazeContext}) {
        pathCtx = pathContext;
        mazeCtx = mazeContext;
    },
// Maze-related
    createMaze: function (cellSelectionMethod = defaultCellSelectionMethod) {
        MazeStore.emitCustomEvent('sprite-sorcerer--animate');

        // ** Future feature
            // Initialize MazeGenerator, in theory if we were to ever update the mazeConfig
            // e.g. resize the maze, potential feature?
        MazeGenerator.initialize(mazeCtx, mazeConfig);

        // Note: maybe redundant we store a maze & mazeConfig.maze
        //       probably store everything in the config
        maze = MazeGenerator.generateMazeModel(cellSelectionMethod);
        mazeConfig.maze = maze;
        MazeGenerator.drawMaze(maze);
        MazeStore.provideContextsAndMazeModel();
    },
    _redrawMaze: function(cellSelectionMethod) {
        // Emit sprite events
        MazeStore.emitCustomEvent('sprite-sorcerer--animate');
        MazeStore.emitCustomEvent('sprite-alaska--toggle-speech-visibility');
    
        // Clear any potentially running scripts, including saved/recording steps
        MazePathController.clearTimeout();                    
        MazePathController.clearCanvas();
        MazeStore._resetRecordedSteps();
        MazeStore.resetSteps();

        // Save new maze model, provide walker with updated maze model
        maze = MazeGenerator.generateMazeModel(cellSelectionMethod);
        mazeConfig.maze = maze;
        MazeGenerator.drawMaze(maze);
        WalkerManager.updateConfig(mazeConfig);

        // ** Future feature:
            // emit an event to provide an updated mazeConfig to mazeLayer, in case of resizing of maze
            // MazeStore.emitChange(); // to provide mazeConfig to mazeLayer
    },
    provideContextsAndMazeModel: function () {
        WalkerManager.initialize(pathCtx, mazeConfig);
        MazePathController.initialize(pathCtx, WalkerManager, mazeConfig);
    },
    getMazeConfig: function() {
        return mazeConfig;
    },
    destroyWall: function(numWalls) {
        let walls = MazeStore.gatherWalls(maze);
        let wallIndex;

        for (let i = 0; i < numWalls; i++) {
            // getRandomIntInclusive
            // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
            wallIndex = Math.floor(Math.random() * walls.length);
            maze[walls[wallIndex][1]][walls[wallIndex][0]] = 1;
        }
        mazeConfig.maze = maze;
        // MazeStore.provideContextsAndMazeModel();
        WalkerManager.updateConfig(mazeConfig);
        MazeGenerator.drawMaze(maze);
        MazePathController.clearCanvas();
        MazeStore._resetRecordedSteps();
        // re-update walker and whatever else you need to
    },
    gatherWalls: function (mazeModel) {
        let walls = [];
        // Our maze is 20 x 20 but last row and last col are OUTER walls so need to account for
        for (let y = 0; y < mazeModel.length - 1; y++) {
            for (let x = 0; x < mazeModel.length - 1; x++) {
                if (mazeModel[y][x] === 0) {
                    walls.push([x, y]);
                }
            }
        }
        return walls;
    },
// Steps-related
    getSteps: function() {
        return steps;
    },
    // This is only called when a maze solved event has occured
    getRecordedSteps: function() {
        return recordedSteps;
    },
    recordSteps: function () {
        recordedSteps[currentScript] = steps;
        currentScript = ""; // reset currentScript so that we have some sort of flag for destroying walls,
                            // If someone tries to destroy a wall and there's a currentScript, block it!
    },
    iterateSteps: function() {
        steps++;
        MazeStore.emitCustomEvent("steps--change");
    },
    resetSteps: function() {
        steps = 0;
        MazeStore.emitCustomEvent("steps--change");
    },
    _resetRecordedSteps: function () {
        recordedSteps = {};
        MazeStore.emitCustomEvent("recorded-steps--change");
    },
    _runSolverScript: function(scriptName) {
        // Stop any currently running scripts
        // Clear the pathCtx
        // Initialize the Controller (for any potential changes to mazeConfig)
        // Locate the script and run it

        // Stop and clear any currently running scripts
        MazePathController.clearTimeout();    
        MazePathController.clearCanvas();

        // Reset any steps that were being recorded, re-provide Contexts to reset visited
        MazeStore.resetSteps();
        MazeStore.provideContextsAndMazeModel();

        currentScript = scriptName;
        MazeStore.emitCustomEvent('sprite-alaska--toggle-speech-visibility');
        MazeStore.emitCustomEvent('run-script');


        // we don't need to re-save the path ctx but because it initializes the walker and controller again, we can just use it;
        // MazePathController.initialize(pathCtx, WalkerManager, mazeConfig); // re-initialize for any potential mazeConfig changes

        // Formatting the script path here instead of in a new method because of webpack
        // https://github.com/webpack/webpack/issues/6680
        import("../algos/" + scriptName + ".js").then((script) => {
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
        case "ITERATE_STEPS":
            MazeStore.iterateSteps();
            break;
        case "DESTROY_WALL":
            MazeStore.destroyWall(action.data);
            break;
        case "DEBUG":
            MazePathController.clearTimeout(false);
            break;
        default:
            break;
    };
});


export default MazeStore;