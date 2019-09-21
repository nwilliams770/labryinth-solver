

// Start with a random cell as current cell
// Add cell to active array
// Randomly pick an unvisited neighbor, add to active array (at the back), update as new current cell
// If current cell has no UNVISITED neighbors, remove it from the active array and cell directly following it
// becomes new active cell

// Do this until all active cells empty

const mazeConfig = {
    pathWidth: 10,
    wall: 2,
    outerWall: 2,
    width: 25,
    height: 25,
    wallColor: '#d24',
    pathColor: '#222a33'
}
mazeConfig.canvasWidth = mazeConfig.outerWall * 2 + (mazeConfig.width * (mazeConfig.pathWidth + mazeConfig.wall)) - mazeConfig.wall;
mazeConfig.canvasHeight = mazeConfig.outerWall * 2 + (mazeConfig.height * (mazeConfig.pathWidth + mazeConfig.wall)) - mazeConfig.wall;
// let pathWidth = 10, // Width of Maze Paths
//     wall = 2, // Wall Width (between paths)
//     outerWall = 2, // Outer wall width
//     width = 25, // Num paths horizonally
//     height = 25, // Num paths vertically
//     wallColor = '#d24',   //Color of the walls
//     pathColor = '#222a33',//Color of the path
//     x = _getRandomIndex(0, width) * 2, // horizontal starting position
//     y = _getRandomIndex(0, height) * 2; // vertical starting position



export const MazeGenerator = {
    DIRECTIONS: ["N", "S", "E", "W"],
    DX: {"E": 1, "W": -1, "S": 0, "N": 0},
    DY: {"N": -1, "S": 1, "E": 0, "W": 0},
    mazeConfig: null,
    map: null,
    cellSelectionMethod: null,
    ctx: null,
    // x: null,
    // y: null,

    initialize: function (ctx, cellSelectionMethod, mazeConfig) {
        this.ctx = ctx;
        this.cellSelectionMethod = cellSelectionMethod;
        this.mazeConfig = mazeConfig;
        this.offset = mazeConfig.pathWidth/2 + mazeConfig.outerWall;


        // Setup canvas
        ctx.fillStyle = mazeConfig.wallColor;
        ctx.fillRect(0,0,mazeConfig.canvasWidth,mazeConfig.canvasHeight);
        ctx.strokeStyle = mazeConfig.pathColor;
        ctx.lineCap = 'square';
        ctx.lineWidth = mazeConfig.pathWidth;
        ctx.beginPath();



        // starting X,Y 
        let x = this._getRandomIndex(0, mazeConfig.width - 1), 
            y = this._getRandomIndex(0, mazeConfig.height - 1);

        
        let map = [];
        // ctx.fillStyle = this.mazeConfig.wallColor;
        // ctx.fillRect(0, 0, ctx.width, ctx.height);
        for (let i = 0; i < mazeConfig.height * 2; i++) { // We multiply by two so that our map isn't consisting of just paths, remember our width is how many paths we want
            map[i] = [];
            for (let j = 0; j < mazeConfig.width * 2; j++) {
                map[i][j] = 0;
            }
        }


        // map[y * 2][x * 2] = 1; // mark starting point paths
        // ctx.moveTo(x*(this.mazeConfig.pathWidth+wall)+offset,
        // y*(this.mazeConfig.pathWidth+wall)+offset)

        // this._growTree(map, x, y, cellSelectionMethod);
        this._growTree(ctx, map, x, y, "random")

    },
    _growTree: function (ctx, map, startingX, startingY, cellSelectionMethod='random') {
        let activeCells = [[startingX, startingY]],
            index,
            x,
            y;
        
        console.log("map",map);
        console.log("startingX",startingX);
        console.log("startingY", startingY);

        // Minus 1 to account for 0-indexing, moveTo first location
        map[startingY * 2][startingX * 2] = 1;

        while (activeCells.length > 0) {
            if (activeCells.length > 50) {
                console.log("Fail safe activated! Over 50 active cells at once");
                 break; 
            }
            index = this._nextIndex(activeCells.length, cellSelectionMethod);
            x = activeCells[index][0];
            y = activeCells[index][1];
            console.log("next cell has been pulled (canvas coords below) x:", x, "y", y)
            console.log("moving drawing pointer to ------- x", x * (mazeConfig.pathWidth * mazeConfig.wall) + this.offset, "y", y * (mazeConfig.pathWidth * mazeConfig.wall) + this.offset)
            ctx.moveTo(x * (mazeConfig.pathWidth + mazeConfig.wall) + this.offset, y * (mazeConfig.pathWidth + mazeConfig.wall) + this.offset)


            let validDirection = this._validNeighborCell(map, x, y);
            if (validDirection) {
                console.log("validDirection found! x: ", this.DX[validDirection] + x, "y", this.DY[validDirection] + y);
                // add the newly traversed cell to the stack
                activeCells.push([this.DX[validDirection] + x, this.DY[validDirection] + y]);
                // console.log("valid Direction found! activeCells:")
                // console.log("this.DX[validDirection] + x", this.DX[validDirection] + x);
                // console.log("this.DX[validDirection] + x", this.DX[validDirection] + x);

                // Mark the map
                map[(this.DY[validDirection]+y)*2][(this.DX[validDirection]+x)*2] = 1;
                map[this.DY[validDirection]+y*2][this.DX[validDirection]+x*2] = 1;
                
                // Draw the line and move pointer to new cell
            // *** THIS IS WHERE SOMETHING IS GOING WRONG, looks like x coords at not staying consistent
                let testX = (this.DX[validDirection] + x) * (mazeConfig.pathWidth + mazeConfig.wall) + this.offset;
                let testY = (this.DY[validDirection] + y) * (mazeConfig.pathWidth + mazeConfig.wall) + this.offset;
                console.log("x, y coordinates being passed to drawTo x:", testX, "y:", testY);
                this._drawTo(ctx, 
                            (this.DX[validDirection] + x) * (mazeConfig.pathWidth + mazeConfig.wall) + this.offset, 
                            (this.DY[validDirection] + y) * (mazeConfig.pathWidth + mazeConfig.wall) + this.offset)
                // ctx.moveTo((this.DX[validDirection] + x) * (mazeConfig.pathWidth + mazeConfig.wall) + this.offset, (this.DY[validDirection] + y) * (mazeConfig.pathWidth + mazeConfig.wall) + this.offset)
            } else {
              // remove the cell
            //   console.log(activeCells)

              let removed = activeCells.splice(index, 1);
              console.log("removed cell ***********************", removed);
              ctx.closePath();
              ctx.beginPath();

            }
        }
        this.map = map;
        // ctx.stroke();
        console.log("map!");
        console.log(map);

    },
    // Checks if there is unvisited neighbor cell given a coordinate and a map
    // randomly checks each direction, returning the first coordinate group of a valid neighbor cell
    // if not validneighbor cell is found, false is returned
    _validNeighborCell: function(map, x, y) {
        console.log("checking if there's a valid neighbor cell for ---x", x, "y", y);
        this.DIRECTIONS = this._shuffle(this.DIRECTIONS);

        for (let i = 0; i < this.DIRECTIONS.length; i++) {
          let dir = this.DIRECTIONS[i],
              nx = x + this.DX[dir],
              ny = y + this.DY[dir];
      
            // If we are not out of bounds and the cell has not yet been visited
            if (map[ny * 2] != undefined &&
              map[ny * 2][nx * 2]===0) {
                return this.DIRECTIONS[i];
              }
              // if (nx >= 0 &&
              //     ny >= 0 &&
              //     map[ny * 2] !== undefined &&
              //     map[ny * 2][nx * 2] === 0) {
              //         console.log("found valid cell!");
              //         return [nx, ny];
              //   }
      
          }
          return false;
      },
    _nextIndex: function(length, cellSelectionMethod) {
        switch (cellSelectionMethod) {
            case "random":
                return this._getRandomIndex(0, length - 1);
                break;
            // Items being pushed to back of array, so newest is end of array   
            case "newest":
                return -1;
                break;
            case "oldest":
                return 0;
                break;
            case "random-newest":
                return Math.random() < 0.5 ? this._getRandomIndex(0, length - 1) : 0;
                break;
        }
    },
    _drawTo: function (ctx, x, y) {
        console.log("drawing to the following coords x", x, "y", y);
        ctx.lineTo(x, y)
        ctx.stroke();
        ctx.closePath();
        ctx.beginPath();

    },
// Fisher-Yates shuffle
// https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
    _shuffle: function (array) {
        var currentIndex = array.length, temporaryValue, randomIndex;
  
        // While there remain elements to shuffle...
        while (0 !== currentIndex) {
      
          // Pick a remaining element...
          randomIndex = Math.floor(Math.random() * currentIndex);
          currentIndex -= 1;
      
          // And swap it with the current element.
          temporaryValue = array[currentIndex];
          array[currentIndex] = array[randomIndex];
          array[randomIndex] = temporaryValue;
        }
      
        return array;
    },
// getRandomIntInclusive()
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
    _getRandomIndex(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive 
    },
};

export default MazeGenerator;

// function mazeGenerator(ctx, cellSelectionMethod, mazeConfig) {
//     this.context = context,
//     this.cellSelectionMethod = cellSelectionMethod,
//     this.mazeConfig = mazeConfig,
//     this.DIRECTIONS = ["N", "S", "E", "W"],
//     this.DX = {"E": 1, "W": -1, "S": 0, "N": 0},
//     this.DY = {"N": -1, "S": 1, "E": 0, "W": 0},
//     this.x = this._getRandomIndex(0, mazeConfig.width * 2),
//     this.y = this._getRandomIndex(0, mazeConfig.height * 2);


//     this.init = function (ctx) {
//         let offset = (this.mazeConfig.pathWidth / 2) + this.mazeConfig.outerWall,
//             map = [],
//             activeCells = [];
//         ctx.fillStyle = this.mazeConfig.wallColor;
//         ctx.fillRect(0, 0, canvas.width, canvas.height);
//         for (let i = 0; i < height * 2; i++) { // We multiply by two so that our map isn't consisting of just paths, remember our width is how many paths we want
//             map[i] = [];
//             for (let j = 0; i < width * 2; j++) {
//                 map[i][j] = 0;
//             }
//         }
//         map[y * 2][x * 2] = 1; // mark starting point paths
//         // ctx.moveTo(x*(this.mazeConfig.pathWidth+wall)+offset,
//         // y*(this.mazeConfig.pathWidth+wall)+offset)
//     }

//     this.growTree = function (ctx, map, startingX, startingY, cellSelectionMethod='random') {
//         let activeCells = [[startingX, startingY]],
//             index,
//             x,
//             y;
        
//         while (activeCells.length > 0) {
//             index = findNextIndex(activeCells.length, cellSelectionMethod)
//             x = activeCells[index][0]
//             y = activeCells[index][1]
//             // [x, y] = activeCells[index]

//             shuffle(DIRECTIONS).forEach((dir) => {
//                 nx = x + DX[dir],
//                 ny = y + DY[dir];
//                 if (nx >= 0 &&
//                     ny >= 0 &&
//                     map[ny * 2] != undefined &&
//                     map[ny * 2][nx * 2] === 0) {
//                         activeCells.push([nx, ny])
//                         index = null;
//                     }
//             })
//             if (index) {
//                 activeCells.splice(index, 1);
//             }
//         }

//         // implementation of Fisher-Yates shuffle algo
//         // https://stackoverflow.com/questions/6274339/how-can-i-shuffle-an-array
//         this._shuffle = function (array) {
//             var currentIndex = array.length, temporaryValue, randomIndex;
      
//             // While there remain elements to shuffle...
//             while (0 !== currentIndex) {
          
//               // Pick a remaining element...
//               randomIndex = Math.floor(Math.random() * currentIndex);
//               currentIndex -= 1;
          
//               // And swap it with the current element.
//               temporaryValue = array[currentIndex];
//               array[currentIndex] = array[randomIndex];
//               array[randomIndex] = temporaryValue;
//             }
          
//             return array;
//         }
//         // getRandomIntInclusive() from MDN
//         // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
//         this._getRandomIndex = function (min, max) {
//             min = Math.ceil(min);
//             max = Math.floor(max);
//             return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive 
//         }
//     }
// }


//     function init(ctx) {
//         let offset = (pathWidth / 2) + outerWall,
//             map = [],
//             activeCells = [];
//         ctx.fillStyle = wallColor;
//         ctx.fillRect(0, 0, canvas.width, canvas.height);
//         for (let i = 0; i < height * 2; i++) { // We multiply by two so that our map isn't consisting of just paths, remember our width is how many paths we want
//             map[i] = [];
//             for (let j = 0; i < width * 2; j++) {
//                 map[i][j] = 0;
//             }
//         }
//         map[y * 2][x * 2] = 1; // mark starting point paths
//         // ctx.moveTo(x*(pathWidth+wall)+offset,
//         // y*(pathWidth+wall)+offset)
//     }

//     // Growing Tree Algorithm
//     function growTree(ctx, map, startingX, startingY, cellSelectionMethod='random') {
//         let activeCells = [[startingX, startingY]],
//             index,
//             x,
//             y;
        
//         while (activeCells.length > 0) {
//             index = findNextIndex(activeCells.length, cellSelectionMethod)
//             x = activeCells[index][0]
//             y = activeCells[index][1]
//             // [x, y] = activeCells[index]

//             shuffle(DIRECTIONS).forEach((dir) => {
//                 nx = x + DX[dir],
//                 ny = y + DY[dir];
//                 if (nx >= 0 &&
//                     ny >= 0 &&
//                     map[ny * 2] != undefined &&
//                     map[ny * 2][nx * 2] === 0) {
//                         activeCells.push([nx, ny])
//                         index = null;
//                     }
//             })
//             if (index) {
//                 activeCells.splice(index, 1);
//             }

//         }


//     }


//     // getRandomIntInclusive() from MDN
//     // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random

//     function _getRandomIndex(min, max) {
//         min = Math.ceil(min);
//         max = Math.floor(max);
//         return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive 
//     }


//     // Fisher-Yates shuffle
//     // https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
//     function shuffle(array) {
//         var currentIndex = array.length, temporaryValue, randomIndex;
      
//         // While there remain elements to shuffle...
//         while (0 !== currentIndex) {
      
//           // Pick a remaining element...
//           randomIndex = Math.floor(Math.random() * currentIndex);
//           currentIndex -= 1;
      
//           // And swap it with the current element.
//           temporaryValue = array[currentIndex];
//           array[currentIndex] = array[randomIndex];
//           array[randomIndex] = temporaryValue;
//         }
      
//         return array;
//     }
