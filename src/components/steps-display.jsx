import React, { useState, useEffect } from 'react';
import MazeStore from '../stores/maze-store';

// Ok so what do we want this to do:
//      - Display Steps with corresponding algo + running steps gif
//      Actions
//          - Run solver script:
//              display steps?
//          - Maze Generation change
//              - wipe all previous steps
//          - New algo choice while one running
//              - reset steps of currently running

const StepsDisplay = () => {
    const [steps, updateSteps] = useState(0);
    const [recordedSteps, updateRecordedSteps] = useState([]);

    const getSteps = () => {
        return MazeStore.getSteps();
    }

    const getRecordedSteps = () => {
        return MazeStore.getRecordedSteps();
    }

    const handleIterateEvent = () => {
        console.log("getSteps", getSteps());
        console.log("steps", steps);
        updateSteps(getSteps());
    }

    const handleMazeSolvedEvent = () => {
        updateRecordedSteps(getRecordedSteps());
    }



    useEffect(() => {
        // Listen to iterate steps events coming
        // Listen to mazesolved so we know to add the steps to our state

        MazeStore.addCustomEventListener("steps--iterate", handleIterateEvent);
        MazeStore.addCustomEventListener("steps--maze-solved", handleMazeSolvedEvent);
        return () => {
            MazeStore.removeCustomEventListener("steps--iterate", handleIterateEvent);
            MazeStore.removeCustomEventListener("steps--maze-solved", handleMazeSolvedEvent);
        }
    })

    return (
        <div id="steps-display">

            <p className={steps.length > 0 ? "" : "hidden"}>{steps}</p>
        </div>
    )
}


export default StepsDisplay;