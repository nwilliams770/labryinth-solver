import React from 'react';
import Select from 'react-select';

const SelectorModule = ({ config }) => {
    return (
        <div className="selector">
            <h4 class="label">{config.label}</h4>
            <Select
                className={config.type}
                options={config.options}
                defaultValue={config.defaultValue ? config.options[0] : ""}
                placeholder={config.placeholder ? config.placeholder : ""}
                onChange={(input) => config.handleChange(input)}
                classNamePrefix={"selector"}
                value={config.selection}
                // menuIsOpen={true}
            />
        </div>
    );
};

export default SelectorModule;