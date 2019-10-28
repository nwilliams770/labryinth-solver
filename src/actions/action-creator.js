
import AppDispatcher from '../dispatcher/app-dispatcher';

export const updateCellSelectionMethod = (data) => {
    AppDispatcher.dispatch({
        actionType: "UPDATE_CELL_SELECTION_METHOD",
        data: data
    });
};
