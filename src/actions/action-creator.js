
import AppDispatcher from '../dispatcher/app-dispatcher';

export const UPDATE_MAZE_GENERATION_ALGO = "UPDATE_MAZE_GENERATION_ALGO";


export const updateMazeGenerationConfiguration = (configuration) => {
    AppDispatcher.dispatch({
        actionType: UPDATE_MAZE_GENERATION_ALGO,
        data: configuration
    });
};
