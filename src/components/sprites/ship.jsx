import React, { useState, useRef, useEffect } from 'react';
import SpriteAnimator from 'react-sprite-animator';
import sprite from '../../images/ship-sprite.png';

// TO DO:
// - Update hard-coded ship size once styling is confirmed
// - Move component styling to it's own partial



export const Ship = (props) => {
    const spriteEl = useRef(null);
    const [xPos, updatePos] = useState(-50);
    const xPosRef = useRef(xPos);
    xPosRef.current = xPos;

    // We may be able to use the ref from React to calculate this
    // Also keep in mind that we are using that sprite component so the width might not work
    // or may have to be divdied by 2
    // const shipWidth = document.getElementById("ship").offsetWidth;

    // useEffect accepts a function as a param, if you pass it an empty array as well,
    // we will only call the function ONCE!

    useEffect(() => {
        const shipWidth = 70; // Our sprite is 100 x 100px but surrounded by a lot of white space, just estimating the actual size of the ship itself
        const interval = setInterval(() => { 
            if (xPosRef.current < window.innerWidth ) {
                updatePos(xPosRef.current + 1)
            } else {
                updatePos(-150)
            }
        }, 30);
        return () => { clearInterval(interval)}
    }, []);

    return (
        <div id="ship" class="sprite" style={{left: xPos + 'px'}}>
            <SpriteAnimator
                ref={spriteEl}
                width={100}
                height={100}
                sprite={sprite}
                direction="vertical"
                shouldAnimate={true}
                fps={8}
                startFrame={0}
                stopLastFrame={false}
                reset={true}
                frameCount={2}
                wrapAfter={1}
            />
    </div>
    )
}

export default Ship;