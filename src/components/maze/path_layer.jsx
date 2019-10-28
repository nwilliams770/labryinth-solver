import React, { useRef, useEffect } from 'react';
import WalkerManager from '../../walker/walker';


const PathLayer = ({ mazeConfig }) => {
    let canvasRef = useRef(null);

    useEffect(() => {
        console.log("path_layer.jsx component updating...");
        console.log(mazeConfig.test);
        
    }, [mazeConfig])

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        console.log("initial mazeConfig in path_layer")
        console.log(mazeConfig.test)


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
        WalkerManager.initialize(ctx, mazeConfig);

    }, []);

    return (
        <canvas
            id="path-layer"
            ref={canvasRef}
            width={mazeConfig.canvasWidth}
            height={mazeConfig.canvasHeight}
        />
    );
}

export default PathLayer;