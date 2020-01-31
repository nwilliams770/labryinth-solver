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

const LabelKey = {
    tremaux: "trémaux",
    wallFollower: "wall follower",
    bfs: "breadth-first search",
    aStar: "a*"
}

const RecordedStep = ({script, steps}) => {
    return (
        <div className="recorded-step">
            <p>{steps}<span className="label">{LabelKey[script]}</span></p>
        </div>
    )
};

const StepsDisplay = () => {
    const [steps, updateSteps] = useState(0);
    const [recordedSteps, updateRecordedSteps] = useState({});

    const getSteps = () => {
        return MazeStore.getSteps();
    }

    const getRecordedSteps = () => {
        return MazeStore.getRecordedSteps();
    }

    const handleIterateEvent = () => {
        updateSteps(getSteps());
    }

    const handleMazeSolvedEvent = () => {
        updateRecordedSteps(getRecordedSteps());
    }

    const processRecordedSteps = (recordedSteps) => {
        return (Object.keys(recordedSteps).map(key => {
            return (<RecordedStep key={"step-" + key} script={key} steps={recordedSteps[key]} />)
        }))
    }

    useEffect(() => {
        // Listen to iterate steps events coming
        // Listen to mazesolved so we know to add the steps to our state
        MazeStore.addCustomEventListener("steps--change", handleIterateEvent);
        MazeStore.addCustomEventListener("recorded-steps--change", handleMazeSolvedEvent);
        return () => {
            MazeStore.removeCustomEventListener("steps--change", handleIterateEvent);
            MazeStore.removeCustomEventListener("recorded-steps--change", handleMazeSolvedEvent);
        }
    }, [])
    return (
        <div id="steps-display">
            <h4>iterations</h4>
            <p className={"current " + (steps ? "" : "hidden")}>{steps}</p>
            <div className="recorded-steps-container">
                {processRecordedSteps(recordedSteps)}
            </div>
        </div>
    )
}


export default StepsDisplay;