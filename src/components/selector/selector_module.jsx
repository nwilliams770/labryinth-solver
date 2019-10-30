import React from 'react';
import Select from 'react-select';
// import * as ActionCreator from '../../actions/action-creator';

const SelectorModule = ({ config }) => {
    // const [selected, updateSelection] = useState("newest");

    // console.log("selected", selected);

    const handleChange = (input) => {
        // updateSelection(input.value);
        // console.log("input from seletor_module", input);

        // We can add a ternary operator here to do a different action based on the type of selector;
        // ActionCreator.updateCellSelectionMethod(input.value); 
        // console.log("ActionCreator return value", test);
        // ActionCreator.changeCellSelectionMethod(input.value); 
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
                className={config.type}
                options={config.options}
                defaultValue={config.defaultValue ? config.options[0] : ""}
                placeholder={config.placeholder ? config.placeholder : ""}
                onChange={(input) => config.handleChange(input)}
                classNamePrefix={config.type + "-selector"}
                value={config.selection}
            />
        </div>
    );
}

export default SelectorModule;