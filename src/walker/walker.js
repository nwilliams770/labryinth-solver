import * as ActionCreator from '../actions/action-creator';
// *** SAMPLE MAZE CONFIG ***
// const mazeConfig = {
//     pathWidth: 20,
//     wall: 4,
//     outerWall: 4,
//     width: 10,
//     height: 10,
//     wallColor: '#d24',
//     pathColor: '#222a33'
//     maze: [],
// }
// mazeConfig.canvasWidth = mazeConfig.outerWall * 2 + (mazeConfig.width * (mazeConfig.pathWidth + mazeConfig.wall)) - mazeConfig.wall;
// mazeConfig.canvasHeight = mazeConfig.outerWall * 2 + (mazeConfig.height * (mazeConfig.pathWidth + mazeConfig.wall)) - mazeConfig.wall;

const WalkerManager = {
    initialize: function(ctx, mazeConfig) {
        this.ctx = ctx;
        this.mazeConfig = mazeConfig;
        this.maze = createArray(mazeConfig.maze.length, mazeConfig.maze.length);
        this.x = 0; // startingX
        this.y = 0; // startingY
        this.prevX = 0;
        this.prevY = 0;
        this.visited = createArray(mazeConfig.maze.length, mazeConfig.maze.length);
        this.shadeMap = {
            1: "#fb50a6",
            2: "#c94085",
            3: "#973064",
            4: "#642042"
        };

        this.ctx.strokeStyle = this.shadeMap[1];
        this.ctx.lineCap = "square";
        this.ctx.lineWidth = mazeConfig.pathWidth;
        
        // Set visited to all zeroes
		for (let y = 0; y < mazeConfig.maze.length; y++) {
			for (let x = 0; x < mazeConfig.maze.length; x++) {
				this.visited[y][x] = 0;
			}
        }

        for (let y = 0; y < mazeConfig.maze.length; y++) {
            for (let x = 0; x < mazeConfig.maze.length; x++) {
                mazeConfig.maze[y][x] === 0 ? this.maze[y][x] = "*" : this.maze[y][x] = 0;
            }
        }
        
        // Set starting point
        this.visited[this.y][this.x] = 1;
    },

    draw: function(prevX, prevY, shade) {
        this.ctx.strokeStyle = shade;
        this.ctx.beginPath();
        this.ctx.moveTo(prevX/2 * (this.mazeConfig.pathWidth + this.mazeConfig.wall) + this.mazeConfig.offset, 
                        prevY/2 * (this.mazeConfig.pathWidth + this.mazeConfig.wall) + this.mazeConfig.offset);
        this.ctx.lineTo(this.x/2 * (this.mazeConfig.pathWidth + this.mazeConfig.wall) + this.mazeConfig.offset,
                        this.y/2 * (this.mazeConfig.pathWidth + this.mazeConfig.wall) + this.mazeConfig.offset);
        this.ctx.stroke();
        this.ctx.closePath();
    },
    drawPath: function(path) {
        // set starting x, y
        let startingCell = path.shift();
        let prevX = startingCell[0];
        let prevY = startingCell[1];
        let currentCell;

        while (path.length > 0) {
            currentCell = path.shift();
            this.x = currentCell[0];
            this.y = currentCell[1];
            this.draw(prevX, prevY, this.shadeMap[1]);
            prevX = this.x;
            prevY = this.y;
        }
    },
    visitNeighbors: function(x, y) {
        let cellsToEnqueue = [];
        // set x y to this.x, this.y generate neighbor
        this.x = x;
        this.y = y;


        for (let i = 0; i < 4; i++) {
            let neighbor = this._getXYForDirection(i);
            // console.log("i:", i, "from", [prevX, prevY], "=> neighbor", neighbor);
            if (!this._hasVisited(i) && this._isOpen(neighbor.x, neighbor.y)) {
                // Update this.x, this.y for this.draw
                // Add cells to enqueue
                // Mark visited
                this.x = neighbor.x;
                this.y = neighbor.y;
                this.draw(x, y, this.shadeMap[1]);
                this.visited[this.y][this.x]++;
                // reset this.x and this.y for next neighbors
                this.x = x;
                this.y = y;
                cellsToEnqueue.push(neighbor);
            }
        }
        return cellsToEnqueue;

    },
    getValidNeighbors: function(x, y) {
        let result = [];

        // set x y to this.x, this.y generate neighbor
        this.x = x;
        this.y = y;

        for (let i = 0; i < 4; i++) {
            let neighbor = this._getXYForDirection(i);
            if (neighbor.x >= 0 && 
                neighbor.y >= 0 && 
                this._isOpen(neighbor.x, neighbor.y) &&
                !this.visited[neighbor.y][neighbor.x].closed) {
                    result.push(this.visited[neighbor.y][neighbor.x]);
            }
        }
        return result;
    },
    moveWithWall: function(point) {
        let prevX = this.x,
            prevY = this.y;
        this.x = point[0];
        this.y = point[1];
        let shade = this.visited[this.y][this.x] > 0 ? this.shadeMap[2] : this.shadeMap[1];
        this.draw(prevX, prevY, shade);
        this.visited[this.y][this.x]++;

    },
    moveWithTremaux: function(direction, backtrack) {
        let movedToNewTile = false,
            prevX = this.x,
            prevY = this.y;

        // if we are backtracking OR if we haven't visited the next tile with the current direction
        if (backtrack || !this._hasVisited(direction)) {
            // Get the new x,y for the potential move.
            let point = this._getXYForDirection(direction);
            // Check if this move is valid // if it is then update our walker position
            if (this._canMoveWithTremaux(point.x, point.y)) {
                // console.log("can move to point! updating this.x to X", point.x, "this.y to Y", point.y, "movedToNewTile set to true");
                this.x = point.x;
                this.y = point.y;
                movedToNewTile = true;
            }
        }

        if (movedToNewTile) {
            ActionCreator.iterateSteps();
            this.draw(prevX, prevY, backtrack ? this.shadeMap[2] : this.shadeMap[1]);

            // set new prev coords
            this.prevX = prevX;
            this.prevY = prevY;
    
            // mark as visited
            this.visited[this.y][this.x]++;
    
            if (backtrack) {
                // IF we are backtracking, we've turned around so do not visit the last tile again
                this.visited[this.prevY][this.prevX] = 2;
            }
            
            if (this.visited[prevY][prevX] === 2 && this.visited[this.y][this.x] === 1) {
                // Found an unwalked tile while backtracking, Mark last tile to 1 so we can
                // revisit this tile again
                this.visited[prevY][prevX] = 1;
                this.draw(prevX, prevY, this.shadeMap[1]); // in this edge case we are backtracking but we want to keep this path available
            }
        }
        return movedToNewTile;
    },

    updateConfig: function(mazeConfig) {
        this.initialize(this.ctx, mazeConfig);
        
    },

    _canMoveWithTremaux: function(x, y) {
        return (x >= 0 && y >= 0 && this._isOpen(x, y) && this.visited[y][x] < 2)
    },
    _isWall: function(x, y) {
        return (this.maze[y][x] === "*");
    },
    _isOpen: function(x, y) {
        return !this._isWall(x, y);
    },
    _hasVisited: function(direction) {
        let point = this._getXYForDirection(direction);

        // short circuiting here will prevent any TypeErrors
        return (this._outOfBounds(point) || this.visited[point.y][point.x] > 0)
    },
    _outOfBounds: function(point) {
        return (point.y < 0 || 
                point.x < 0 ||
                this.visited[point.y] === undefined || 
                this.visited[point.y][point.x] === undefined)
    },

    removeColor: function(color) {
        var canvasData = this.ctx.getImageData(0, 0, 256, 256),
        pix = canvasData.data;

        for (var i = 0, n = pix.length; i <n; i += 4) {
            if(pix[i] === color[0] && pix[i+1] === color[1] && pix[i+2] === color[2]){
                pix[i+3] = 0;   
            }
        }

    this.ctx.putImageData(canvasData, 0, 0);
    },

    // ************ Currently not using, can possibly throw away ************
    _getShade: function() {
        let shadeCode = this.maze[this.y][this.x]
        return this.shadeMap[shadeCode];
    },

    // method emulated from Primary Objects
    // http://www.primaryobjects.com/maze
    _getXYForDirection: function(direction) {
        let point = {x: this.x, y: this.y};
        switch(direction) {
                    // TREMAUX | WALL FOLLOWER
            case 0:   // North | Relative Left
                    point.y--;
                    break;
            case 1:    // East | Relative Forward
                    point.x++;
                    break;
            case 2:   // South | Relative Right
                    point.y++;
                    break;
            case 3:    // West | Relative Backward
                    point.x--;
                    break;
        }
        return point;
    }
}

// createArray of length with x dimensions
// https://stackoverflow.com/questions/966225/how-can-i-create-a-two-dimensional-array-in-javascript
function createArray(length) {
    var arr = new Array(length || 0),
        i = length;

    if (arguments.length > 1) {
        var args = Array.prototype.slice.call(arguments, 1);
        while(i--) arr[length-1 - i] = createArray.apply(this, args);
    }

    return arr;
}

export default WalkerManager;