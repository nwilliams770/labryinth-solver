import MazeStore from '../stores/maze-store';

export const MazePathController = {
    initialize: function(ctx, walker, mazeConfig) {
        this.ctx = ctx;
        this.speed = 70;
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
        let id = this.timeoutId * 2;

        while (id--) {
            window.clearTimeout(id); // will do nothing if no timeout with id is present
        }
        this.clearCanvas();
    },
    clearCanvas: function() {
        this.ctx.clearRect(0,0,this.mazeConfig.canvasWidth,this.mazeConfig.canvasHeight);
    },
    run: function() {
        let self = this;

        if (!this.algo.isSolved()) {
            this.algo.step();
            this.timeoutId = setTimeout(function() {
                self.run();
            }, this.speed);
        } else {
            this.algo.solve();
            MazeStore.recordSteps();
            MazeStore.resetSteps();
            MazeStore.emitCustomEvent('recorded-steps--change');
            MazeStore.emitCustomEvent('maze-solved');
        };
    },
}

export default MazePathController;