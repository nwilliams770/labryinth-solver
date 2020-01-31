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
            {value: "newest-random", label: "50% Newest | 50% Random"}
        ],
        type: "maze",
        placeholder: false,
        defaultValue: {value: "newest", label: "Newest"},
        handleChange: (input) => {
            updateAlgoSelection("");
            updateMazeSelection(input);
            ActionCreator.updateCellSelectionMethod(input.value);
        },
        selection: mazeSelection,
        label: "Maze Generation Cell Selection Method",
        styles: {
            option: (provided, state) => ({
                ...provided,
                color: state.isSelected ? 'black' : 'white',
                fontSize: '10px',
                lineHeight: 1.2,
                padding: 10,
                backgroundColor: state.isSelected ? 'white' : 'black',
                ':hover': {
                    color: 'black',
                    backgroundColor: '#d8e8fe'
                }
            }),

            control: (provided, state) => ({
                ...provided,
                borderRadius: '0',
                border: '1px solid white',
                backgroundColor: 'black',
                ':hover': {
                    border: '1px solid white'
                }

            }),
            menu: (provided, state) => ({
                ...provided,
                backgroundColor: 'black',
                borderRadius: 0,
                border: 0
            }),
            singleValue: (provided, state) => ({
                ...provided,
                fontSize: '10px',
                color: 'white'
            }),
            placeholder: (provided, state) => ({
                ...provided,
                color: '#2B2B2A',
                fontSize: '10px'
            })
        }
    };
    // Tremaux (DFS)
    // Wall Follower (Left Hand Rule)
    // BFS (Shortest Path)
    // A* (yields shortest path as well)

    const algoConfig = {
        options: [
            {value:"tremaux", label: "Trémaux"},
            {value:"wallFollower", label: "Wall Follower"},
            {value:"bfs", label: "Breadth-First Search"},
            {value:"aStar", label: "A*"}
        ],
        type: "algo",
        placeholder: "Algorithm",
        defaultValue: false,
        handleChange: (input) => {
            updateAlgoSelection(input);
            ActionCreator.runSolverScript(input.value);
        },
        selection: algoSelection,
        label: "Maze Solving Algorithm",
        styles: {
            option: (provided, state) => ({
                ...provided,
                color: state.isSelected ? 'black' : 'white',
                fontSize: '10px',
                lineHeight: 1.2,
                padding: 10,
                backgroundColor: state.isSelected ? 'white' : 'black',
                ':hover': {
                    color: 'black',
                    backgroundColor: '#d8e8fe'
                }
            }),
            control: (provided, state) => ({
                ...provided,
                borderRadius: '0',
                border: '1px solid white',
                backgroundColor: 'black',
                ':hover': {
                    border: '1px solid white'
                }
            }),
            menu: (provided, state) => ({
                ...provided,
                backgroundColor: 'black',
                borderRadius: 0,
                border: 0
            }),
            singleValue: (provided, state) => ({
                ...provided,
                fontSize: '10px',
                color: 'white'
            }),
            placeholder: (provided, state) => ({
                ...provided,
                color: '#2B2B2A',
                fontSize: '10px'
            })
        }

    };

    return (
        <div id="selector-modules">
            <SelectorModule 
                config={algoConfig}
                value={algoSelection}
            />
            <SelectorModule 
                config={mazeConfig}
                value={mazeSelection}
                styles={mazeConfig.styles}
            />
        </div>

    );
};

export default SelectorModules;
