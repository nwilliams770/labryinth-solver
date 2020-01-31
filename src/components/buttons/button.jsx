import React from 'react';


const Button = ({config , enabled}) => {
    return (
        <button
            onClick={() => config.handleClick(config.type)}
            className={"button " + config.copy + (enabled ? "" : " disabled")}
        >
            <img src={config.icon} alt='An icon for a button' />
            <p>{config.copy}</p>
        </button>
    )
}

export default Button;
