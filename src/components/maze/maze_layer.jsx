import React, { useRef, useEffect } from 'react';
import MazeStore from '../../stores/maze-store';

const MazeLayer = ({ mazeConfig }) => {
    let canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');


        // let ratio = getPixelRatio(ctx),
        //     width = getComputedStyle(canvas)
        //         .getPropertyValue('width')
        //         .slice(0, -2),
        //     height = getComputedStyle(canvas)
        //         .getPropertyValue(canvas)
        //         .slice(0, -2);
        // canvas.width = width * ratio;
        // canvas.height = height * ratio;
        // canvas.style.width = `${width}px`;
        // canvas.style.height = `${height}px`;

        MazeStore.generateMaze(ctx);
    }, [])

    return (
        <canvas
            id="maze-layer"
            ref={canvasRef}
            width={mazeConfig.canvasWidth}
            height={mazeConfig.canvasHeight}
        />
    )
}

export default MazeLayer;