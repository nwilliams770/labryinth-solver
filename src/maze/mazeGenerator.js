// Start with a random cell as current cell
// Add cell to active array
// Pick an unvisited neighbor, add to active array (at the back), update as new current cell
// If current cell has no UNVISITED neighbors, remove it from the active array and cell directly following it
// becomes new active cell
// Do this with specified cellSelectionMethod until all active cells empty

// SAMPLE MAZE CONFIG
// const mazeConfig = {
//     pathWidth: 10, // Width of Maze Paths
//     wall: 2, // Wall Width (between paths)
//     outerWall: 2, // Outer wall width
//     width: 25, // Num paths horizonally
//     height: 25, // Num paths vertically
//     wallColor: '#d24', //Color of the walls
//     pathColor: '#222a33' //Color of the path
// }
// mazeConfig.canvasWidth = mazeConfig.outerWall * 2 + (mazeConfig.width * (mazeConfig.pathWidth + mazeConfig.wall)) - mazeConfig.wall;
// mazeConfig.canvasHeight = mazeConfig.outerWall * 2 + (mazeConfig.height * (mazeConfig.pathWidth + mazeConfig.wall)) - mazeConfig.wall;

export const MazeGenerator = {
    DIRECTIONS: ["N", "S", "E", "W"],
    DX: {"E": 1, "W": -1, "S": 0, "N": 0},
    DY: {"N": -1, "S": 1, "E": 0, "W": 0},
    map: null,
    offset: null,

    initialize: function (ctx, cellSelectionMethod, mazeConfig) {
        this.ctx = ctx;
        this.mazeConfig = mazeConfig;


        // Setup canvas
        this.ctx.fillStyle = mazeConfig.wallColor;
        this.ctx.fillRect(0,0,mazeConfig.canvasWidth,mazeConfig.canvasHeight);
        this.ctx.strokeStyle = mazeConfig.pathColor;
        this.ctx.lineCap = 'square';
        this.ctx.lineWidth = mazeConfig.pathWidth;
        this.ctx.beginPath();

        // starting X,Y 
        let x = this._getRandomIndex(0, mazeConfig.width - 1), 
            y = this._getRandomIndex(0, mazeConfig.height - 1);

        let map = this._createMap(mazeConfig.width, mazeConfig.height);
        
        this._growTree(ctx, map, x, y, cellSelectionMethod, mazeConfig)
        return this.map;

    },
    // Redraws the maze under the assumption initialize has already been called e.g. we have a mazeConfig & ctx
    redrawMaze: function (newCellSelectionMethod) {
        // reset canvas
        this.ctx.fillRect(0,0,this.mazeConfig.canvasWidth,this.mazeConfig.canvasHeight);
        // starting X,Y 
        let x = this._getRandomIndex(0, this.mazeConfig.width - 1), 
            y = this._getRandomIndex(0, this.mazeConfig.height - 1),
            map = this._createMap(this.mazeConfig.width, this.mazeConfig.height);
        this._growTree(this.ctx, map, x, y, newCellSelectionMethod, this.mazeConfig);
        return this.map;
        
    },
    _growTree: function (ctx, map, startingX, startingY, cellSelectionMethod, mazeConfig) {
        let activeCells = [[startingX, startingY]],
            index,
            x,
            y,
            validDirection;

        map[startingY * 2][startingX * 2] = 1;

        while (activeCells.length > 0) {
            index = this._nextIndex(activeCells.length, cellSelectionMethod);
            x = activeCells[index][0];
            y = activeCells[index][1];
            ctx.moveTo(x * (mazeConfig.pathWidth + mazeConfig.wall) + mazeConfig.offset, y * (mazeConfig.pathWidth + mazeConfig.wall) + mazeConfig.offset);


            validDirection = this._validNeighborCell(map, x, y);
            if (validDirection) {
                // add the newly traversed cell to the stack
                activeCells.push([this.DX[validDirection] + x, this.DY[validDirection] + y]);

                // Mark the map
                map[(this.DY[validDirection]+y)*2][(this.DX[validDirection]+x)*2] = 1;
                map[this.DY[validDirection]+y*2][this.DX[validDirection]+x*2] = 1;
                
                // Draw the line and move pointer to new cell
                this._drawTo(ctx, 
                            (this.DX[validDirection] + x) * (mazeConfig.pathWidth + mazeConfig.wall) + mazeConfig.offset, 
                            (this.DY[validDirection] + y) * (mazeConfig.pathWidth + mazeConfig.wall) + mazeConfig.offset)
            } else {
              // remove the cell
              activeCells.splice(index, 1);
            };
        };

        // Draw entrance/exit
        this.ctx.fillStyle = 'yellow';
        this.ctx.fillRect(mazeConfig.outerWall,0,mazeConfig.pathWidth,mazeConfig.outerWall);
        this.ctx.fillRect(mazeConfig.canvasWidth - mazeConfig.outerWall - mazeConfig.pathWidth,mazeConfig.canvasHeight - mazeConfig.outerWall,mazeConfig.pathWidth,mazeConfig.outerWall);
        this.ctx.fillStyle = mazeConfig.wallColor; // Revert fillStyle for future redraws 

        this.map = map;

    },
    _createMap: function (width, height) {
        let map = [];
        for (let i = 0; i < height * 2; i++) { // We multiply by two so that our map isn't consisting of just paths, remember our width is how many paths we want
            map[i] = [];
            for (let j = 0; j < width * 2; j++) {
                map[i][j] = 0;
            }
        }
        return map;
    },
    // Checks if there is unvisited neighbor cell given a coordinate and a map
    // randomly checks each direction, returning the first coordinate group of a valid neighbor cell
    // if not validneighbor cell is found, false is returned
    _validNeighborCell: function (map, x, y) {
        this.DIRECTIONS = this._shuffle(this.DIRECTIONS);

        for (let i = 0; i < this.DIRECTIONS.length; i++) {
          let dir = this.DIRECTIONS[i],
              nx = x + this.DX[dir],
              ny = y + this.DY[dir];
      
            // If we are not out of bounds and the cell has not yet been visited
            if (map[ny * 2] !== undefined &&
                map[ny * 2][nx * 2]===0) 
            {
                return this.DIRECTIONS[i];
            };
              // if (nx >= 0 &&
              //     ny >= 0 &&
              //     map[ny * 2] !== undefined &&
              //     map[ny * 2][nx * 2] === 0) {
              //         console.log("found valid cell!");
              //         return [nx, ny];
              //   }
      
        };
          return false;
    },
    _nextIndex: function (length, cellSelectionMethod) {
        switch (cellSelectionMethod) {
            case "random":
                return this._getRandomIndex(0, length - 1);
            case "newest":
                return length - 1;
            case "oldest":
                return 0;
            case "newest-random":
                return Math.random() < 0.5 ? this._getRandomIndex(0, length - 1) : length - 1;
            default:
                break;
        }
    },
    _drawTo: function (ctx, x, y) {
        ctx.lineTo(x, y)
        ctx.stroke();
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
    _getRandomIndex: function (min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive 
    },
};

export default MazeGenerator;