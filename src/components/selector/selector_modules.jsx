import React from 'react';
import SelectorModule from './selector_module';

const mazeOptions = [
    {value: "newest", label: "Newest"},
    {value: "oldest", label: "Oldest"},
    {value: "random", label: "Random"},
    {value: "newest-random", label: "Newest/Random (50/50 split)"}
]

const pathOptions = [

]

const mazeDefaultValue = "newest";
const pathPlaceHolderText = "Select an Algorithm";

const SelectorModules = () => {
    return (
        <div id="selector-modules">
            <SelectorModule options={pathOptions} type="path" />
            <SelectorModule options={mazeOptions} type="maze" />
        </div>

    )
}

export default SelectorModules;
