// START [1][1]
// END [18][18]  // note last row is always all 0s, so do not consider
// MAZE ARRAY WIDTH/HEIGHT = mazeConfig.width * 2 / mazeConfig.height * 2
// 
// Also know as depth-first search

const dfs = {
    initialize: function (walker) {
        this.walker = walker;
        this.direction = 0;
        // For 10 x 10 maze
        // this.end = {x: 18, y: 18}
        this.end = {x: 8, y: 8}
        this.cycle = 0;
    },
// temp modification to take it step by step
    step: function() {
        let direction = this.direction;
        // console.log("stepping with Tremaux, starting direction is:", direction);
        this.cycle = 0;

        while (!this.walker.move(this.direction)) {
            this.direction++;
            // this.cycle++;
            if (this.cycle > 10000) {
                console.log("Cycle count over 10000");
                console.log("this.walker", this.walker);
                // console.log("going in cycles here");
                // console.log("this.walker", this.walker);
                throw new Error("cycle count > 5000");
                // break;
                this.cycle = 0;
            }
            // console.log("walker cannot move, iterating direction to", this.direction);            
            if (this.direction > 3) {
                // console.log("direction > 3, resetting direction to 0")'
                this.direction = 0;
            }

            if (this.direction === direction) {
                // console.log("this.direciton = direction, gone in a circle...backtracking..direction:",direction, "this.direction", this.direction);
                while (!this.walker.move(this.direction, true)) {

                    this.direction++;
                    this.cycle++;
                    if (this.cycle > 10000) {
                        console.log("Cycle count over 10000 in backtracking");
                        console.log("this.walker", this.walker);
                        // console.log("this.walker", this.walker);
                        throw new Error("cycle count > 5000 in backtracking");
                        // break;
                        this.cycle = 0;
                    }
    
                    // console.log("can't move while backtracking, iterating direction to", this.direction);

                    if (this.direction > 3) {
                        // console.log("while backtracking, direction > 3, resetting to 0");
                        this.direction = 0;
                    }
                }
                break;
            }

        }


    },

    // step: function() {
    //     let startingDirection = this.direction;

    //     // If we can't move, change direction
    //     while (!this.walker.move(this.direction)) {
    //         console.log("this.direction!", this.direction);
    //         this.direction++;
            

    //         // If we've iterated past 3, we've gone in a full circle and have to backtrack // reset direction
    //         if (this.direction > 3) {
    //             this.direction = 0;
    //         }

    //         if (this.direction == startingDirection) {
    //             // We've turned in a circle with no path avail. Backtrack time
    //             // If we can't we've hit a wall and need to change direction
    //             while (!this.walker.move(this.direction, true)) {
    //                 this.direction++;

    //                 if (this.direction > 3) {
    //                     this.direction = 0;
    //                 }
    //             }

    //             break;
    //         }
    //     }
    //     // this.walker.draw();

    // },

    isSolved: function() {
        return (this.walker.x === this.end.x && this.walker.y === this.end.y);
    },

    solve: function () {
        for (let y = 0; y < this.walker.maze.length; y++) {
            for (let x = 0; x < this.walker.maze.length; x++) {
                if (this.walker.visited[y][x] === 1) {
                    this.walker.ctx.fillStyle = 'pink';
                    this.walker.ctx.fillRect()
                }
            }
        }
    }
}


// export const dfs = function (walker) {
//     this.walker = walker;
//     this.direction = 0;
//     this.end = {x: 18, y: 18};

//     this.run = function() {
//         console.log("I've been run!");
//     };

//     this.step = function() {
//         let startingDirection = this.direction;

//         // If we can't move, change direction
//         while (!this.walker.move(this.direction)) {
//             this.direction++;

//             // If we've iterated past 3, we've gone in a full circle and have to backtrack // reset direction
//             if (this.direction > 3) {
//                 this.direction = 0;
//             }

//             if (this.direction == startingDirection) {
//                 // We've turned in a circle with no path avail. Backtrack time
//                 // If we can't we've hit a wall and need to change direction
//                 while (!this.walker.move(this.direction, true)) {
//                     this.direction++;

//                     if (this.direction > 3) {
//                         this.direction = 0;
//                     }
//                 }

//                 break;
//             }
//         }
//         this.walker.draw();
//     };

//     this.isSolved = function() {
//         return (this.walker.x == this.end.x && this.walker.y == this.end.y);
//     };

//     this.solve = function() {
//         // Draw solution path

//     }

// }

export default dfs;