
import AppDispatcher from '../dispatcher/app-dispatcher';

export const updateCellSelectionMethod = (data) => {
    AppDispatcher.dispatch({
        actionType: "UPDATE_CELL_SELECTION_METHOD",
        data: data
    });
};

export const runSolverScript = (scriptName) => {
    AppDispatcher.dispatch({
        actionType: "RUN_SOLVER_SCRIPT",
        scriptName: scriptName
    });
};

export const iterateSteps = () => {
    AppDispatcher.dispatch({
        actionType: "ITERATE_STEPS",
    });
};

export const destroyWall = (numWalls) => {
    AppDispatcher.dispatch({
        actionType: "DESTROY_WALL",
        data: numWalls
    });
};