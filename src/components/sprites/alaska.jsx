import React, { useEffect, useState, useRef } from 'react';
import sprite from '../../images/alaska.png';
import MazeStore from '../../stores/maze-store';



// What is this going to do?
// Alaska walks every couple seconds, paces | CSS Keyframe animation?
// Speech bubble appears and disappears with new text

// On action MAZE SOLVED
// victory speech, pacing stops
function getRandomArbitrary(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

const speeches = [
    "I'll give you $10,000, via PayPal, if you get me out of this maze...",
    "You're not my real dad and you never will be, Maze Wizard scum!",
    "Are you red...y for me, Maze Wizard?",
    "Hieeeeeeeeeeeeeee",
    "I know that Anus-thing is possible, but will I EVER get out of here?",
    "I don't even know what a warp drive is...",
    "Escaped at last! Time to accost this Maze Wizard and bring his bodacious treasures back to my people!"
]

const Alaska = () => {
    const [xPos, updatePos] = useState(300);
    const [facingRight, updateFacingRight] = useState(true);
    const [hidden, hideSpeech] = useState(true);
    const [currentSpeech, updateSpeech] = useState(speeches[1]);

    const currentSpeechRef = useRef(currentSpeech);
    const facingRightRef = useRef(facingRight);
    const xPosRef = useRef(xPos);
    const hiddenRef = useRef(hidden);
    facingRightRef.current = facingRight;
    xPosRef.current = xPos;
    currentSpeechRef.current = currentSpeech;
    hiddenRef.current = hidden;

    const handleEvent = (paceId) => {
        clearInterval(paceId);
    }


    useEffect(() => {
        MazeStore.addSpriteEventListener('alaska', handleEvent);
        let paceId = setInterval(paceAnimation, 30000);
        // TO DO
        // addchange listeners for when the maze is completed
        //      stop movements
        //      show last speech in array
        // setInterval or random time to perform actions
        // functionality for showing speech bubbles

        // porbably put everything in one giant func
        return () => {
            MazeStore.removeSpriteEventListener('alaska', handleEvent);
            clearInterval(paceId);
        }
    }, []);

    function displaySpeech(mazeSolved) {
        if (mazeSolved) {
            let solvedSpeech = speeches[-1];
            updateSpeech(solvedSpeech);
            hideSpeech(false);
        } else {
            let randomIndex = Math.floor(getRandomArbitrary(0, speeches.length - 1));
            let speech = speeches[getRandomArbitrary(0, speeches.length - 1)]
            updateSpeech(speech);
            hideSpeech(false);
        }
    }
    function paceAnimation() {
        const zeroPoint = 300; // where our sprite is position on the page by default
        // posistion thresholds for animations

        // Add some randomization here
        const config = {
            smallPaceRight: (50 + zeroPoint),
            smallPaceLeft: (zeroPoint),
            mediumPaceRight: (200 + zeroPoint),
            largePaceRight: (450 + zeroPoint),
            mediumPaceLeft: (-100 + zeroPoint)
        }
        let smallPaces = 0;
        const smallPaceBackForthId = setInterval(smallPaceBackForth, 20);
        const speechId = setInterval(function() {
            hideSpeech(!hiddenRef.current);
            setTimeout(displaySpeech, 2000);
        }, 5000);


        function mediumPaceAndDoubleTake() {
            // Walk left, double takes, walk right
            let doubleTakes = 0,
                walkLeftId = setInterval(walkLeft, 20),
                walkRightId,
                doubleTakesId;

            // Turn left
            updateFacingRight(false);
            // walk left interval
            
            
            doubleTakesId = setInterval(function () {
                updateFacingRight(!facingRightRef.current);
                doubleTakes++
                if (doubleTakes > 4) {
                    clearInterval(doubleTakesId);
                    walkRightId = setInterval(walkRight, 20);
                }
            }, 2200);




            function walkLeft() {
                if (xPosRef.current > config["mediumPaceLeft"]) {
                    updatePos(xPosRef.current - 1);
                    return;
                } else if (xPosRef.current === config["mediumPaceLeft"]) {
                    clearInterval(walkLeftId);
                }
            }

            function walkRight() {
                if (xPosRef.current < zeroPoint) {
                    updatePos(xPosRef.current + 1);
                    return;
                } else if (xPosRef.current === zeroPoint) {
                    clearInterval(walkRightId);
                    console.log("clear interval!");
                    clearInterval(speechId);
                    
                    hideSpeech(!hiddenRef.current);
                }
            }
        }

        function smallPaceBackForth() {
            // pace back and forth 4 times, starting from zeroPoint
            // calls mediumPaceAndDoubleTake upon completion

            if (xPosRef.current === config["smallPaceLeft"] && !facingRightRef.current && smallPaces > 4) {
                // We have finished the animation
                //      Turn to faceRight
                //      Clear the interval
                updateFacingRight(true);
                clearInterval(smallPaceBackForthId);
                mediumPaceAndDoubleTake();
            } else if (xPosRef.current < config["smallPaceRight"] && facingRightRef.current) {
                // Walking Right
                updatePos(xPosRef.current + 1);
                return;
            } else if (xPosRef.current > config["smallPaceLeft"] && !facingRightRef.current) {
                // Walking Left
                updatePos(xPosRef.current - 1);
                return;
            } else if (xPosRef.current === config["smallPaceRight"] && facingRightRef.current) {
                // We just completed a pace to the right
                //      Iterate paces
                //      Turn to left

                smallPaces++;
                updateFacingRight(false);
                return;
            } else if (xPosRef.current === config["smallPaceLeft"] && !facingRightRef.current) {
                // We just completed a pace to the left
                //      Iterate paces
                //      Turn to the right
                smallPaces++;
                updateFacingRight(true);
                return;
            }

        };

    }

    return (
        <div id="alaska" style={{left: xPos + 'px'}}>
            <SpeechBubble 
                speech={currentSpeech}
                facingRight={facingRight}
                hidden={hidden}
            />
            <img style={{transform: `scaleX(${facingRight ? 1 : -1})`}} src={sprite}/>
        </div>
    );
};

const SpeechBubble = ({ speech, facingRight, hidden }) => {
    return (
        <div id="speech" style={{visibility: hidden ? 'hidden' : 'visible'}}> 
            <div class="arrow"></div>
            <p>{speech}</p>
        </div>
    )
}

export default Alaska;