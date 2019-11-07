import React from 'react';
import Select from 'react-select';

const SelectorModule = ({ config }) => {
    return (
        <div className="selector">
            <Select
                className={config.type}
                options={config.options}
                defaultValue={config.defaultValue ? config.options[0] : ""}
                placeholder={config.placeholder ? config.placeholder : ""}
                onChange={(input) => config.handleChange(input)}
                classNamePrefix={"selector"}
                value={config.selection}
            />
        </div>
    );
};

export default SelectorModule;