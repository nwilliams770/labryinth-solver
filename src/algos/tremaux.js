import MazePathController from '../controller/mazeController';

const dfs = {
    initialize: function (ctx, walker, mazeConfig) {
        this.walker = walker;
        this.direction = 0;
        // For 10 x 10 maze
        this.end = {x: 18, y: 18};
        this.mazeConfig = mazeConfig;
        this.ctx = ctx;
        this.visitedStackX = [];
        this.visitedStackY = [];
        this.backTracking = false;
    },
    step: function() {
        let startingDirection = this.direction;

        if (this.backTracking) {
            this.walker.backtrackWithTremaux() ? this.backTracking = false : this.backTracking = true;
        } else {
            while (!this.walker.moveWithTremaux(this.direction)) {
                this.direction++; // Hit a wall, turn right (N => E => S => W)
                // reset direction
                if (this.direction > 3) {
                    this.direction = 0;
                }

                // We haven't been able to go in any direction, time to backtrack
                if (this.direction === startingDirection) {
                    this.backTracking = true;
                    break;
                };

            };
        }
    },
    isSolved: function() {
        return (this.walker.x === this.end.x && this.walker.y === this.end.y);
    },
    solve: function () {
        MazePathController.clearCanvas();
        this.walker.drawPathFromStack();
    }
}

export default dfs;