// This controller file, only concerned with the PATH layer, is written to:
//  Receive the mazeConfig and path layer context
//  Provide an easy and simple API for our MazeStore to use when running an algo
//  Act as the intermediary between the algorithm script and the walker
//  Possibly emit the approriate actions like "DRAWING CANVAS" or "TAKING STEP"

export const MazePathController = {
    initialize: function(ctx, walker, mazeConfig) {
        this.ctx = ctx;
        this.maze = mazeConfig.maze;
        this.speed = null;
        this.walker = walker;
        this.algorithm = null;
        this.mazeConfig = mazeConfig;
        this.currentTimeout = null;
    },

    initializeScript: function(algo) {
        this.algo = algo;
        algo.initialize(this.walker);
    },


    clearTimeouts: function() {
        if (this.currentTimeout) {
            clearTimeout(this.currentTimeout);
        }
    },

    run: function() {
        // since we are dealing with the window here, we need to encapsulate this
        // in order to create our nice setTimeout recursion
        let self = this;
        if (!this.algo.isSolved()) {
            this.algo.step();
            setTimeout(function() {
                self.run();
            }, 300);
        } else {
            alert("maze solved!");
        }
    },


}

export default MazePathController;
