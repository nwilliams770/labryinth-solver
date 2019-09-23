import React, { useState, useRef } from 'react';
import SpriteAnimator from 'react-sprite-animator';
import sorcererSpriteSheet from '../../images/sorcerer-sprite.png'; // weird to do but per the docs I guess https://create-react-app.dev/docs/adding-images-fonts-and-files

const Sorcerer = (props) => {
    const [isClicked, setClicked] = useState(false);
    const spriteEl = useRef(null);

    return (
        <div id="sorcerer" class="sprite" onClick={() => setClicked(!isClicked)}>
            <SpriteAnimator
                ref={spriteEl}
                width={210}
                height={190}
                sprite={sorcererSpriteSheet}
                direction="vertical"
                shouldAnimate={isClicked}
                fps={10}
                startFrame={0}
                stopLastFrame={true}
                reset={!isClicked}
                // frameCount={9}
                frameCount={15}
                wrapAfter={1}
            />
    </div>
    )
}

export default Sorcerer;