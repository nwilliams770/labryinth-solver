import React, { useState, useRef, useEffect, useCallback } from 'react';
import SpriteAnimator from 'react-sprite-animator';
import sorcererSpriteSheet from '../../images/sorcerer-sprite.png'; // weird to do but per the docs I guess https://create-react-app.dev/docs/adding-images-fonts-and-files
import MazeStore from '../../stores/maze-store';

const Sorcerer = (props) => {
    const [shouldAnimate, setAnimate] = useState(true);
    const spriteEl = useRef(null);

    const handleSpriteEvent = useCallback((event) => {
        // Don't think this is best practice here but we need a way to toggle shouldAnimate
        // from true back to false on each spriteEvent
        // Kind of a constraint of using this external software
        // In hindsight, it would've been better to initiate sprite with a function call instead of a bool value
        setAnimate(true);
        setTimeout(() => {
            setAnimate(false);
        }, 1500);
    }, []);

    useEffect(() => {
        MazeStore.addCustomEventListener('sprite-sorcerer--animate', handleSpriteEvent);
        // Set to false for future animation triggers
        setTimeout(() => {
            setAnimate(false);
        }, 1500);

        return () => {
            MazeStore.removeCustomEventListener('sprite-sorcerer--animate', handleSpriteEvent);
        }
    }, [handleSpriteEvent]);

    return (
        <div id="sorcerer" className="sprite">
            <SpriteAnimator
                ref={spriteEl}
                width={210}
                height={190}
                sprite={sorcererSpriteSheet}
                direction="vertical"
                shouldAnimate={shouldAnimate}
                fps={10}
                startFrame={0}
                stopLastFrame={true}
                frameCount={15}
                wrapAfter={1}
                reset={!shouldAnimate}
            />
    </div>
    );
};

export default Sorcerer;