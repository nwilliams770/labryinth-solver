import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { updateMazeGenerationConfiguration } from '../../actions/action-creator';

const SelectorModule = ({ options, type }) => {
    // const [selected, updateSelection] = useState("newest");

    // console.log("selected", selected);

    const handleChange = (input) => {
        // updateSelection(input.value);
        // console.log("input from seletor_module", input);

        // We can add a ternary operator here to do a different action based on the type of selector;
        updateMazeGenerationConfiguration(input.value); 
    }
    // useEffect(() => {
    //     // function handleSelection(input) {
    //     //     updateSelection(input);

    //     // }
    //     console.log("using Effect in selector module!");

    // }, [selected]);

    return (
        <div className="selector">
            <Select
                className={type}
                options={options}
                defaultValue={options[0]}
                onChange={ (input) => handleChange(input)}
            />
        </div>
    );
}

export default SelectorModule;