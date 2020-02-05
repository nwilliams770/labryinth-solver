import React, { useEffect, useState, useRef } from 'react';
import sprite from '../../images/alaska.png';
import MazeStore from '../../stores/maze-store';

function getRandomArbitraryExlusive(min, max, exclusion) {
    let num = Math.floor(Math.random() * (max - min) + min);

    while (num === exclusion) {
        num = Math.floor(Math.random() * (max - min) + min);
    };
    return num;
}

const speeches = [
    "I'll give you $10,000, via PayPal, if you get me out of this maze...",
    "You're not my real dad and you never will be, Maze Wizard scum!",
    "When I'm good, I'm good but when I'm bad I blow up your planet.",
    "I'm a businesswoman of the 80s who doesn't want romance without finance.",
    "Are you red...y for me, Maze Wizard?",
    "Hieeeeeeeeeeeeeee!",
    "Your makeup is terrible, Maze Wizard.",
    "My name is yours, what's Alaska?",
    "Escaped at last! Time to accost this Maze Wizard and bring his bodacious treasures back to my people!"
];

const Alaska = () => {
    const [xPos, updateXPos] = useState(300);
    const [alaskaDirection, updateDirection] = useState("right");
    const [speechVisible, toggleSpeech] = useState(false);
    const speechVisibleRef = useRef(speechVisible);
    speechVisibleRef.current = speechVisible;
    const [currentSpeech, changeSpeech] = useState(speeches[0]);

    const [timeoutId, updateTimeoutId] = useState(0);
    const timeoutIdRef = useRef(timeoutId);
    timeoutIdRef.current = timeoutId;

    const [pause, pauseAnimation] = useState(false);
    const pauseRef = useRef(pause);
    pauseRef.current = pause;

    const [leftoverAnimationTime, updateLeftoverAnimationTime] = useState(0);
    const leftoverAnimationTimeRef = useRef(leftoverAnimationTime);
    leftoverAnimationTimeRef.current = leftoverAnimationTime;

    // Browser compatibility for requestAnimationFrame
    // https://www.sitepoint.com/simple-animations-using-requestanimationframe/
    const _requestAnimationFrame = function(win, t) {
        return win["webkitR" + t] || win["r" + t] || win["mozR" + t]
                || win["msR" + t] || function(fn) { setTimeout(fn, 60) }
    }(window, "equestAnimationFrame");

    const animation = [
        // Walk far right
        {
            time: 3,
            start: 300,
            end: 415,
            run: function (rate) {
                updateXPos((rate*(this.end - this.start) + this.start));
            }
        },
        // Pause
        {
            time: 1.5,
            run: function (rate) {
                if (rate === 0) {
                    let currentSpeechIndex = speeches.indexOf(currentSpeech);
                    changeSpeech(speeches[getRandomArbitraryExlusive(0, speeches.length - 2, currentSpeechIndex)]);
                    toggleSpeech(true);
                }
            }
        },
        // Look back and forth, ending facing left
        {
            time: 0.5,
            run: function (rate) {
                if (rate === 0) updateDirection(previousDir => previousDir === "right" ? "left" : "right");
            }
        },
        {
            time: 0.5,
            run: function (rate) {
                if (rate === 0) updateDirection(previousDir => previousDir === "right" ? "left" : "right");
            }
        },
        {
            time: 0.5,
            run: function (rate) {
                if (rate === 0) updateDirection(previousDir => previousDir === "right" ? "left" : "right");
            }
        },
        {
            time: 0.5,
            run: function (rate) {
                if (rate === 0) updateDirection(previousDir => previousDir === "right" ? "left" : "right");
            }
        },
        {
            time: 0.15,
            run: function (rate) {
                if (rate === 0) updateDirection(previousDir => previousDir === "right" ? "left" : "right");
            }
        },
        // Walk left then Pace back and forth
        {
            time: 0.75,
            start: 415,
            end: 350,
            run: function (rate) {
                // if (rate === 0) toggleSpeech(prevState => !prevState) // hide speech
                if (rate === 0) toggleSpeech(false) // hide speech

                updateXPos((rate*(this.end - this.start) + this.start));
            }
        },
        {
            time: 0.5,
            start: 350,
            end: 400,
            run: function (rate) {
                if (rate === 0) updateDirection(previousDir => previousDir === "right" ? "left" : "right");
                updateXPos((rate*(this.end - this.start) + this.start));
            }
        },
        {
            time: 0.5,
            start: 400,
            end: 350,
            run: function (rate) {
                if (rate === 0) updateDirection(previousDir => previousDir === "right" ? "left" : "right");
                updateXPos((rate*(this.end - this.start) + this.start));
            }
        },
        {
            time: 0.5,
            start: 350,
            end: 400,
            run: function (rate) {
                if (rate === 0) updateDirection(previousDir => previousDir === "right" ? "left" : "right");
                updateXPos((rate*(this.end - this.start) + this.start));
            }
        },
        // Walk far left, pause, then return to initial 0-point (300px)
        {
            time: 3,
            start: 400,
            end: 200,
            run: function (rate) {
                if (rate === 0) updateDirection(previousDir => previousDir === "right" ? "left" : "right");
                updateXPos((rate*(this.end - this.start) + this.start));
            }
        },
        {
            time: 2,
            run: function (rate) {
                if (rate === 0) {
                    let currentSpeechIndex = speeches.indexOf(currentSpeech);
                    changeSpeech(speeches[getRandomArbitraryExlusive(0, speeches.length - 2, currentSpeechIndex)]);;
                    // toggleSpeech(prevState => !prevState); // show speech
                    toggleSpeech(true);
                }
            }
        },
        {
            time: 2,
            start: 200,
            end: 300,
            run: function (rate) {
                if (rate === 0) updateDirection(previousDir => previousDir === "right" ? "left" : "right");
                // if (rate === 1) toggleSpeech(prevState => !prevState); // hide speech
                if (rate === 1) toggleSpeech(false); // hide speech

                updateXPos((rate*(this.end - this.start) + this.start));
            }
        },
    ];

    const animate = (list) => {
        let item,
            duration,
            end = 0,
            animationList = list.map(obj => ({...obj}) ); // .shift() will modify our original array which we need to loop the animation
            //    same as   list.map(obj => Object.assign({}, a));

        const step = () => {
            if (pauseRef.current) {
                _requestAnimationFrame(step);
                saveLeftoverAnimationTime(animationList);
                return;
            }
            let current = Date.now(),
                remaining = end - current;

            if (remaining < 60) {
            // end animation here as less than 60ms left, which is our frame rate
                if (item) item.run(1) // 1 = progress at 100%

                item = animationList.shift(); // get next animation to start

                if (item) {
                    duration = item.time * 1000;
                    end = current + duration;
                    item.run(0); //0 = progress is at 0%
                } else {
                    return;
                }
            } else {
                let rate = remaining/duration;
                // Easing formula
                // https://www.sitepoint.com/simple-animations-using-requestanimationframe/
                rate = 1 - Math.pow(rate, 3);
                // rate = 1 - rate;
                item.run(rate);
            }
            _requestAnimationFrame(step);

        };
        step();
    }

    const saveLeftoverAnimationTime = (list) => {
        let total = 0;
        list.forEach(obj => total += obj.time);
        updateLeftoverAnimationTime(total);
    }

    const handleMazeSolvedEvent = function() {
        changeSpeech(speeches[speeches.length - 1])
        toggleSpeech(true);
        pauseAnimation(true);
        clearCurrentTimeout();
    };

    const handleToggleSpeechEvent = function() {
        // If paused, it means maze was previously solved
        if (pauseRef.current) {
            if (speechVisibleRef.current) toggleSpeech(false);
            pauseAnimation(false);
        }
    };

    const clearCurrentTimeout = function() {
        clearTimeout(timeoutIdRef);
    }

    const loopAnimation = (initialAnimation, unpausingAnimation, animation) => {
        let totalAnimatiomTimeLoop = 0;
        animation.forEach(item => totalAnimatiomTimeLoop += item.time * 1000);
        totalAnimatiomTimeLoop += 4500; // 4.5s delay in-between animations

        const loop = () => {
            animate(animation);
            updateTimeoutId(setTimeout(loop, totalAnimatiomTimeLoop));
        };
        if (initialAnimation) {
            animate(animation);
            updateTimeoutId(setTimeout(loop, totalAnimatiomTimeLoop));
        } else if (unpausingAnimation) {
            updateTimeoutId(setTimeout(loop, leftoverAnimationTimeRef));
        } else {
            updateTimeoutId(setTimeout(loop, totalAnimatiomTimeLoop));
        }
    }

    useEffect(() => {
        MazeStore.addCustomEventListener('maze-solved', handleMazeSolvedEvent);
        MazeStore.addCustomEventListener('sprite-alaska--toggle-speech-visibility', handleToggleSpeechEvent);
        setTimeout(function () {
            loopAnimation(true, false, animation);
        }, 1000);
        return () => {
            MazeStore.removeCustomEventListener('maze-solved', handleMazeSolvedEvent);
            MazeStore.removeCustomEventListener('sprite-alaska--toggle-speech-visibility', handleToggleSpeechEvent);
        }
    }, []);

    return (
        <div id="alaska" style={{left: `${xPos}` + 'px'}}>

            <SpeechBubble
                alaskaDirection={alaskaDirection}
                currentSpeech={currentSpeech}
                speechVisible={speechVisible}
            />
            <img style={{ transform: `scaleX(${alaskaDirection === "right" ? 1 : -1 }`}} src={sprite}/>
        </div>
    );
};

const SpeechBubble = ({ currentSpeech, alaskaDirection, speechVisible }) => {
    return (
        // <div id="speech" style={{visibility: speechVisible ? 'visible' : 'hidden', transform: `scaleX(${alaskaDirection === "right" ? 1 : -1 }` }}>
        <div id="speech" style={{visibility: speechVisible ? 'visible' : 'hidden'}}>
            <div className={"arrow " + (alaskaDirection === "right" ? "" : "inverted")}></div>
            <p>{currentSpeech}</p>
        </div>
    )
}

export default Alaska;