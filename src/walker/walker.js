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
        this.ctx.beginPath();
        ctx.moveTo(this.x * (mazeConfig.pathWidth + mazeConfig.wall) + this.mazeConfig.offset, this.y * (mazeConfig.pathWidth + mazeConfig.wall) + this.mazeConfig.offset)
        
        // Set visited to all zeroes
		for (let y = 0; y < mazeConfig.maze.length; y++) {
			for (let x = 0; x < mazeConfig.maze.length; x++) {
				this.visited[y][x] = 0;
			}
        }

        for (let y = 0; y < mazeConfig.maze.length; y++) {
            for (let x = 0; x < mazeConfig.maze.length; x++) {
                // For now I'm setting this to 9 because it will be easier to read the maze in the
                // console, but it should probably be set to "*" or something for prevention of bugs
                mazeConfig.maze[y][x] === 0 ? this.maze[y][x] = "*" : this.maze[y][x] = 0;
            }
        }
        
        // Set starting point
        this.visited[this.y][this.x] = 1;

    },

    // ********** TO-DO: **********
    //  - Remove drawing functionality from move method and add to here
    draw: function() {
    },

    move: function(direction, backtrack) {
        let movedToNewTile = false,
            prevX = this.x,
            prevY = this.y;

        // if we are backtracking OR if we haven't visited the next tile with the current direction
        if (backtrack || !this._hasVisited(direction)) {
            // Get the new x,y for the potential move.
            let point = this._getXYForDirection(direction);

            // Check if this move is valid // if it is then update our walker position
            if (this._canMove(point.x, point.y)) {
                // console.log("can move to point! updating this.x to X", point.x, "this.y to Y", point.y, "movedToNewTile set to true");
                this.x = point.x;
                this.y = point.y;
                movedToNewTile = true;
            }

        }

        if (movedToNewTile) {
            this.ctx.strokeStyle = backtrack ? this.shadeMap[2] : this.shadeMap[1];
            this.ctx.beginPath();
            this.ctx.moveTo(prevX/2 * (this.mazeConfig.pathWidth + this.mazeConfig.wall) + this.mazeConfig.offset, 
                            prevY/2 * (this.mazeConfig.pathWidth + this.mazeConfig.wall) + this.mazeConfig.offset);
            this.ctx.lineTo(this.x/2 * (this.mazeConfig.pathWidth + this.mazeConfig.wall) + this.mazeConfig.offset,
                            this.y/2 * (this.mazeConfig.pathWidth + this.mazeConfig.wall) + this.mazeConfig.offset);
            this.ctx.stroke();

            this.prevX = prevX;
            this.prevY = prevY;

            this.visited[this.y][this.x]++;
            // console.log("walker position updated, iterated visited:", this.visited, "this.x", this.x, "this.y", this.y);
            // console.log("compare with maze", this.maze);



            if (backtrack) {
                // console.log("backtracking so setting visited to 2");
                this.visited[this.prevX][this.prevY] = 2;
            }
            
            if (this.visited[prevY][prevX] === 2 && this.visited[this.y][this.x] === 1) {
                // Found an unwalked tile while backtracking, Mark last tile to 1 so we can
                this.visited[prevY][prevX] = 1;
                this.ctx.strokeStyle = this.shadeMap[1];
                this.ctx.beginPath();
                this.ctx.moveTo(this.x/2 * (this.mazeConfig.pathWidth + this.mazeConfig.wall) + this.mazeConfig.offset,
                                this.y/2 * (this.mazeConfig.pathWidth + this.mazeConfig.wall) + this.mazeConfig.offset);
                this.ctx.lineTo(prevX/2 * (this.mazeConfig.pathWidth + this.mazeConfig.wall) + this.mazeConfig.offset, 
                                prevY/2 * (this.mazeConfig.pathWidth + this.mazeConfig.wall) + this.mazeConfig.offset);

                this.ctx.stroke();
				// this.ctx.fillRect(prevX * 10, prevY * 10, 10, 10);          /// ****** FIX THIS
            }
        }
        return movedToNewTile;
    },

    updateConfig: function(mazeConfig) {
        this.initialize(this.ctx, mazeConfig);
        
    },

    _canMove: function(x, y) {
        // console.log("can move in X:", x, "Y:", y, "direction?", (this._isOpen(x, y) && this.visited[y][x] < 2));
        if (!(this._isOpen(x, y) && this.visited[y][x] < 2)) {
            // console.log("X:", x, "Y:", y, "cannot be moved to");
            // console.log("this.maze", this.maze);
            // console.log("this.visited", this.visited);
        }
        return (this._isOpen(x, y) && this.visited[y][x] < 2)
    },

    _isWall: function(x, y) {
        return (x < 0 || y < 0 || this.maze[y][x] === "*");
    },
    _isOpen: function(x, y) {
        return !this._isWall(x, y);
    },

    _hasVisited: function(direction) {
        let point = this._getXYForDirection(direction);

        // short circuiting here will prevent any TypeErrors
        return (this._outOfBounds(point) && this.visited[point.y][point.x] > 0)
    },

    _outOfBounds: function(point) {
        return (point.y < 0 || 
                point.x < 0 ||
                this.visited[point.y] === undefined || 
                this.visited[point.y][point.x] === undefined)
    },

    _getShade: function() {
        let shadeCode = this.maze[this.y][this.x]
        return this.shadeMap[shadeCode];
    },

    // method emulated from Primary Objects
    // http://www.primaryobjects.com/maze
    _getXYForDirection: function(direction) {
        let point = {x: this.x, y: this.y};
        switch(direction) {
            case 0: // North
                    // point.x = this.x;
                    // point.y = this.y - 1;
                    point.y--;
                    break;
            case 1: // East

                    // point.x = this.x + 1;
                    // point.y = this.y;
                    point.x++;
                    break;
            case 2: // South
                    // point.x = this.x;
                    // point.y = this.y + 1;
                    point.y++;
                    break;
            case 3: // West
                    // point.x = this.x - 1;
                    // point.y = this.y;
                    point.x--
                    break;
        }
        // console.log("getXYDirection, this.x:", this.x, "this.y", this.y, "point after calculation", point);
        return point;
    }
}

// http://www.primaryobjects.com/maze
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

