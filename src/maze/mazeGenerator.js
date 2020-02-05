// Start with a random cell as current cell
// Add cell to active array
// Pick an unvisited neighbor, add to active array (at the back), update as new current cell
// If current cell has no UNVISITED neighbors, remove it from the active array and cell directly following it
// becomes new active cell
// Do this with specified cellSelectionMethod until all active cells empty

export const MazeGenerator = {
    DIRECTIONS: ["N", "S", "E", "W"],
    DX: {"E": 1, "W": -1, "S": 0, "N": 0},
    DY: {"N": -1, "S": 1, "E": 0, "W": 0},
    map: null,
    offset: null,

    initialize: function (ctx, mazeConfig) {
        this.ctx = ctx;
        this.mazeConfig = mazeConfig;

        // Setup canvas
        this.ctx.fillStyle = mazeConfig.wallColor;
        this.ctx.fillRect(0,0,mazeConfig.canvasWidth,mazeConfig.canvasHeight);
        this.ctx.strokeStyle = mazeConfig.pathColor;
        this.ctx.lineCap = 'square';
        this.ctx.lineWidth = mazeConfig.pathWidth;
        this.ctx.beginPath();
    },
    generateMazeModel: function (cellSelectionMethod) {
        // starting X,Y
        let x = this._getRandomIndex(0, this.mazeConfig.width - 1),
            y = this._getRandomIndex(0, this.mazeConfig.height - 1);

        this.mazeModel = this._createMap(this.mazeConfig.width, this.mazeConfig.height);

        this._growTree(this.mazeModel, x, y, cellSelectionMethod);

        return this.mazeModel;
    },
    drawMaze: function (mazeModel) {
        this._clearCanvas();

        for (let y = 0; y < mazeModel.length; y++) {
            for (let x = 0; x < mazeModel[y].length; x++) {
                if (mazeModel[y][x] === 1) {
                    this.ctx.fillStyle = this.mazeConfig.pathColor;

                    this.ctx.fillRect(x/2 * (this.mazeConfig.pathWidth + this.mazeConfig.wall) + this.mazeConfig.wall, y/2 * (this.mazeConfig.pathWidth + this.mazeConfig.wall) + this.mazeConfig.wall, this.mazeConfig.pathWidth, this.mazeConfig.pathWidth);
                    // this.ctx.fillRect(x/2 * (this.mazeConfig.pathWidth + this.mazeConfig.wall) + this.mazeConfig.offset, y/2 * (this.mazeConfig.pathWidth + this.mazeConfig.wall) + this.mazeConfig.offset, this.mazeConfig.pathWidth, this.mazeConfig.pathWidth);
                }
            }
        }
        this._drawEntraceExit();
    },
    // Redraws the maze under the assumption initialize has already been called e.g. we have a mazeConfig & ctx
    redrawMaze: function (newCellSelectionMethod) {
        this._clearCanvas();
        // starting X,Y
        let x = this._getRandomIndex(0, this.mazeConfig.width - 1),
            y = this._getRandomIndex(0, this.mazeConfig.height - 1),
            map = this._createMap(this.mazeConfig.width, this.mazeConfig.height);
        this._growTree(map, x, y, newCellSelectionMethod);
        return this.mazeModel;
    },
    _growTree: function (mazeModel, startingX, startingY, cellSelectionMethod) {
        let activeCellStackX = [startingX],
            activeCellStackY = [startingY],
            activeStackSize = 1,
            index,
            x,
            y,
            validDirection;

        mazeModel[startingY * 2][startingX * 2] = 1;

        while (activeStackSize > 0) {
            index = this._nextIndex(activeStackSize, cellSelectionMethod);
            x = activeCellStackX[index];
            y = activeCellStackY[index];

            validDirection = this._exploreNeighborCells(mazeModel, x, y);
            if (validDirection) {
                // Add the valid cell to the stack
                // activeCellsStack.push([this.DX[validDirection] + x, this.DY[validDirection] + y]);
                activeCellStackX.push(this.DX[validDirection] + x);
                activeCellStackY.push(this.DY[validDirection] + y)
                activeStackSize++;


                // Mark the mazeModel, multiplying by 2 to compensate for double-sizing of mazeModel
                mazeModel[(this.DY[validDirection]+y)*2][(this.DX[validDirection]+x)*2] = 1;
                mazeModel[this.DY[validDirection]+y*2][this.DX[validDirection]+x*2] = 1;
            } else {
              // remove the cell
              activeCellStackX.splice(index, 1);
              activeCellStackY.splice(index, 1);
              activeStackSize--;

            };
        };

        this.mazeModel = mazeModel;
    },
    // Given a [X, Y], randomly checks each neighbor cell, returning direction code of first valid neighbor
    // A valid neighbor cell is one that is within bounds and has not been visited previously
    // If no valid neighbors, returns false
    _exploreNeighborCells: function (map, x, y) {
        this.DIRECTIONS = this._shuffle(this.DIRECTIONS);

        for (let i = 0; i < this.DIRECTIONS.length; i++) {
          let dir = this.DIRECTIONS[i],
              nx = x + this.DX[dir],
              ny = y + this.DY[dir];

            if (map[ny * 2] !== undefined &&
                map[nx * 2] !== undefined &&
                map[ny * 2][nx * 2] === 0)
            {
                return this.DIRECTIONS[i];
            };
        };
          return false;
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
    _drawEntraceExit: function () {
        // Draw entrance/exit
        this.ctx.fillStyle = 'yellow';
        this.ctx.fillRect(this.mazeConfig.outerWall,0,this.mazeConfig.pathWidth,this.mazeConfig.outerWall);
        this.ctx.fillRect(this.mazeConfig.canvasWidth - this.mazeConfig.outerWall - this.mazeConfig.pathWidth,this.mazeConfig.canvasHeight - this.mazeConfig.outerWall,this.mazeConfig.pathWidth,this.mazeConfig.outerWall);
        this.ctx.fillStyle = this.mazeConfig.wallColor; // Revert fillStyle for future redraws
    },
    _clearCanvas: function () {
        this.ctx.fillRect(0,0,this.mazeConfig.canvasWidth,this.mazeConfig.canvasHeight);
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