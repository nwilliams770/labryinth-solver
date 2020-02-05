import React, { useState, useEffect } from 'react';
import Button from './button';
import * as ActionCreator from '../../actions/action-creator';
import timesOneIcon from '../../images/bomb-x1.png';
import timesFiveIcon from '../../images/bomb-x5.png';
import MazeStore from '../../stores/maze-store';

const WallDestroyButtons = () => {
    const [buttonsEnabled, enableButtons] = useState(true);

    const handleRunScriptEvent = () => {
        enableButtons(false);
    }

    const handleMazeSolvedEvent = () => {
        enableButtons(true);
    }

    useEffect(() => {
        MazeStore.addCustomEventListener("run-script", handleRunScriptEvent);
        MazeStore.addCustomEventListener("maze-solved", handleMazeSolvedEvent);
        return () => {
            MazeStore.removeCustomEventListener("run-script", handleRunScriptEvent);
            MazeStore.removeCustomEventListener("maze-solved", handleMazeSolvedEvent);
        }
    }, [])

    const timesFiveConfig = {
        type: 5,
        // Seems weird that we are importing here, then passing down as props as opposed to
        // passing down an explicit file path
        // Guessing related to webpack relative file pathing?
        icon: timesOneIcon,
        copy: "x5",
        handleClick: (type) => {
            if (buttonsEnabled) {
                ActionCreator.destroyWall(type);
            }
        }
    };

    const timesTenConfig = {
        type: 10,
        icon: timesFiveIcon,
        copy: "x10",
        handleClick: (type) => {
            if (buttonsEnabled) {
                ActionCreator.destroyWall(type);
            }
        }
    };

    // For Dev Purposes Only
    const timesFiftyConfig = {
        type: 50,
        icon: timesFiveIcon,
        copy: "x50",
        handleClick: (type) => {
            if (buttonsEnabled) {
                ActionCreator.destroyWall(type);
            }
        }
    };

    return (
        <div className="wall-destroy-buttons">
            <h4 className="header">Destroy a Wall</h4>
            {/* <h4 className="header small">(note: may cause cycles)</h4> */}
            <div className="button-container">
                <Button config={timesFiveConfig} enabled={buttonsEnabled}/>
                <Button config={timesTenConfig} enabled={buttonsEnabled}/>
            </div>
        </div>
    )
}

export default WallDestroyButtons;