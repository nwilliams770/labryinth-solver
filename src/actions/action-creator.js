
import AppDispatcher from '../dispatcher/app-dispatcher';

export const UPDATE_MAZE_GENERATION_CONFIG = "UPDATE_MAZE_GENERATION_CONFIG";


export const updateMazeGenerationConfig = (configuration) => {
    AppDispatcher.dispatch({
        type: UPDATE_MAZE_GENERATION_CONFIG,
        data: configuration
    })
}
