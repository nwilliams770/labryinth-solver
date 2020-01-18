import React, { useState, useEffect } from 'react';
import Button from './button';
import * as ActionCreator from '../../actions/action-creator';
import timesOneIcon from '../../images/bomb-x1.png';
import timesFiveIcon from '../../images/bomb-x5.png';
import MazeStore from '../../stores/maze-store';

const WallDestroyButtons = () => {
    const [buttonsEnabled, enableButtons] = useState(true);

    const scriptRunning = function () {
        return MazeStore.scriptRunning() ? true : false;
    }

    const handleRunScriptEvent = () => {
        enableButtons(false);
    }

    const handleMazeSolvedEvent = () => {
        console.log("maze solved event in wall destroy");
        enableButtons(true);
    }

    useEffect(() => {
        // Listen to iterate steps events coming
        // Listen to mazesolved so we know to add the steps to our state

        MazeStore.addCustomEventListener("run-script", handleRunScriptEvent);
        MazeStore.addCustomEventListener("maze-solved", handleMazeSolvedEvent);
        return () => {
            MazeStore.removeCustomEventListener("run-script", handleRunScriptEvent);
            MazeStore.removeCustomEventListener("maze-solved", handleMazeSolvedEvent);
        }
    }, [])

    const timesOneConfig = {
        type: 1,
        // Seems weird that we are importing here, then passing down as props as opposed to
        // passing down an explicit file path
        // Guessing related to webpack relative file pathing?
        icon: timesOneIcon,
        copy: "x1",
        handleClick: (type) => {
            ActionCreator.destroyWall(type);
        }
    };

    const timesFiveConfig = {
        type: 5,
        icon: timesFiveIcon,
        copy: "x5",
        handleClick: (type) => {
            ActionCreator.destroyWall(type);
        }
    };

    return (
        <div className="wall-destroy-buttons">
            <h4 className="header">Destroy a Wall</h4>
            <h4 className="header small">(note: may cause cycles)</h4>
            <div className="button-container">
                <Button config={timesOneConfig} enabled={buttonsEnabled}/>
                <Button config={timesFiveConfig} enabled={buttonsEnabled}/>
            </div>

        </div>
    )
}

export default WallDestroyButtons;

