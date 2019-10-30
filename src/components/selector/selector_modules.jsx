import React, { useState } from 'react';
import SelectorModule from './selector_module';
import * as ActionCreator from '../../actions/action-creator';

const SelectorModules = () => {
    const [mazeSelection, updateMazeSelection] = useState({value: "newest", label: "Newest"});
    const [algoSelection, updateAlgoSelection] = useState("");


    const mazeConfig = {
        options: [
            {value: "newest", label: "Newest"},
            {value: "oldest", label: "Oldest"},
            {value: "random", label: "Random"},
            {value: "newest-random", label: "Newest/Random (50/50 split)"}
        ],
        type: "maze",
        placeholder: false,
        defaultValue: {value: "newest", label: "Newest"},
        handleChange: (input) => {
            updateAlgoSelection("");
            updateMazeSelection(input);
            ActionCreator.updateCellSelectionMethod(input.value);
        },
        selection: mazeSelection
    };
    
    const algoConfig = {
        options: [
            {value:"tremaux", label: "Trémaux (DFS)"}
        ],
        type: "algo",
        placeholder: "Select a solving method",
        defaultValue: false,
        handleChange: (input) => {
            updateAlgoSelection(input);
            ActionCreator.runSolverScript(input.value);
        },
        selection: algoSelection
    };

    console.log("mazeSelection", mazeSelection)

    return (
        <div id="selector-modules">
            <SelectorModule 
                config={algoConfig}
                value={algoSelection}
            />
            <SelectorModule 
                config={mazeConfig}
                value={mazeSelection}
            />
        </div>

    )
}

export default SelectorModules;
