// START [1][1]
// END [18][18]  // note last row is always all 0s, so do not consider
const dfs = {
    initialize: function (ctx, walker, mazeConfig) {
        this.walker = walker;
        this.direction = 0;
        // For 10 x 10 maze
        this.end = {x: 18, y: 18};
        this.mazeConfig = mazeConfig;
        this.ctx = ctx;
        // this.end = {x:98, y:98 }
        // For our smaller maze
        // this.end = {x: 8, y: 8}
    },
    step: function() {
        let startingDirection = this.direction; // always start with 0 instead of whatever this.direction was last set to?

        // While the walker is unable to move in this.direction..
        while (!this.walker.moveWithTremaux(this.direction)) {
            this.direction++; // Hit a wall, turn right (N => E => S => W)

            
            // reset direction
            if (this.direction > 3) {
                this.direction = 0;
            }

            // We haven't been able to go in any di
            if (this.direction === startingDirection) {
                // Turned in a circle with no direction to go, time to backtrack
                while (!this.walker.moveWithTremaux(this.direction, true)) {
                    this.direction++;
                    // reset direction
                    if (this.direction > 3) {
                        this.direction = 0;
                    };
                };

                break;
            };

        };


    },
    isSolved: function() {
        return (this.walker.x === this.end.x && this.walker.y === this.end.y);
    },

    // https://stackoverflow.com/questions/7348618/html5-canvas-clipping-by-color

    solve: function () {
        this.walker.removeColor([201,64,133]);
        // for (let y = 0; y < this.walker.maze.length; y++) {
        //     for (let x = 0; x < this.walker.maze.length; x++) {
        //         if (y === 4) {
        //             // this.ctx.strokeStyle = "green";
        //         }
        //         if (this.walker.visited[y][x] === 2) {
        //             this.ctx.fillStyle='orange';
        //             // console.log("this.mazeConfig.offset!", this.mazeConfig.offset);
        //             // this.ctx.fillRect(x/2 * (this.mazeConfig.pathWidth + this.mazeConfig.wall) + this.mazeConfig.offset, y/2 * (this.mazeConfig.pathWidth + this.mazeConfig.wall) + this.mazeConfig.offset, this.mazeConfig.pathWidth, this.mazeConfig.pathWidth);
        //             this.ctx.fillRect(x/2 * (this.mazeConfig.pathWidth + this.mazeConfig.wall) + this.mazeConfig.outerWall, y/2 * (this.mazeConfig.pathWidth + this.mazeConfig.wall) + this.mazeConfig.outerWall, this.mazeConfig.pathWidth, this.mazeConfig.pathWidth);
                    
        //             // this.ctx.beginPath();
        //             // this.ctx.moveTo(prevX/2 * (this.mazeConfig.pathWidth + this.mazeConfig.wall) + this.mazeConfig.offset, 
        //             //                 prevY/2 * (this.mazeConfig.pathWidth + this.mazeConfig.wall) + this.mazeConfig.offset);
        //             // this.ctx.lineTo(x/2 * (this.mazeConfig.pathWidth + this.mazeConfig.wall) + this.mazeConfig.offset,
        //             //                 y/2 * (this.mazeConfig.pathWidth + this.mazeConfig.wall) + this.mazeConfig.offset);
        //             // this.ctx.stroke();
        //             // this.ctx.closePath();
        //             // prevY = y;
        //             // prevX = x;
        //         }
        //     }
        // }
    }
}

export default dfs;