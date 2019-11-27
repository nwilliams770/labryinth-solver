// This controller file, only concerned with the PATH layer, is written to:
//  Receive the mazeConfig and path layer context
//  Provide an easy and simple API for our MazeStore to use when running an algo
//  Act as the intermediary between the algorithm script and the walker
//  Possibly emit the approriate actions like "DRAWING CANVAS" or "TAKING STEP"

import MazeStore from '../stores/maze-store';


export const MazePathController = {
    initialize: function(ctx, walker, mazeConfig) {
        this.ctx = ctx;
        this.maze = mazeConfig.maze;
        this.speed = 50;
        this.walker = walker;
        this.algorithm = null;
        this.mazeConfig = mazeConfig;
        this.timeoutId = null;
    },

    initializeScript: function(algo) {
        this.algo = algo;
        algo.initialize(this.ctx, this.walker, this.mazeConfig);
    },



    clearTimeout: function() {
        if (this.timeoutId) {
            clearTimeout(this.timeoutId);
        }
    },

    clearCanvas: function() {
        this.ctx.clearRect(0,0,this.mazeConfig.canvasWidth,this.mazeConfig.canvasHeight);
    },


    // This wil have to deal with multiple run methods depending
    run: function() {
        // since we are dealing with the window here, we need to encapsulate this
        // in order to create our nice setTimeout recursion
        let self = this;

        // alert("maze solved!");
        if (!this.algo.isSolved()) {
            this.algo.step();
            // this.algo.step();
            this.timeoutId = setTimeout(function() {
                self.run();
            }, this.speed);
        } else {

            this.algo.solve();
            MazeStore.emitSpriteEvent('alaska--maze-solved');

        }
    },


}

export default MazePathController;
