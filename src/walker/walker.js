import * as ActionCreator from '../actions/action-creator';

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
        this.xStack = [];
        this.yStack = [];
        this.stackSize = 0;
        this.shadeMap = {
            1: "#fb50a6",
            2: "#c94085",
            3: "#973064",
            4: "#642042"
        };

        this.ctx.strokeStyle = this.shadeMap[1];
        this.ctx.lineCap = "square";
        this.ctx.lineWidth = mazeConfig.pathWidth;
        
        this.generateVistedTilesModel();

        // Set starting point
        this.visited[this.y][this.x] = 1;

        // Have our stack ready
        this.xStack.push(this.x);
        this.yStack.push(this.y);
        this.stackSize++;
    },
    generateVistedTilesModel: function () {
        // Clear visited
		for (let y = 0; y < this.mazeConfig.maze.length; y++) {
			for (let x = 0; x < this.mazeConfig.maze.length; x++) {
				this.visited[y][x] = 0;
			}
        }

        // Add walls
        for (let y = 0; y < this.mazeConfig.maze.length; y++) {
            for (let x = 0; x < this.mazeConfig.maze.length; x++) {
                this.mazeConfig.maze[y][x] === 0 ? this.maze[y][x] = "*" : this.maze[y][x] = 0;
            }
        }
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
    drawPathFromStack: function () {
        let path = [];
        for (let i = 0; i < this.stackSize; i++) {
            let point = [this.xStack.pop(), this.yStack.pop()];
            path.unshift(point);
        }
        this.drawPath(path);
    },
// BFS Related
    visitAndEnqueueNeighbors: function(x, y) {
        let cellsToEnqueue = [];
        // set x y to this.x, this.y to get getXYForDirection
        this.x = x;
        this.y = y;


        for (let i = 0; i < 4; i++) {
            let neighbor = this._getXYForDirection(i);
            if (!this.outOfBounds(neighbor) && this.isOpen(neighbor) && this._unvisited(neighbor) > 0) {
                // Update this.x, this.y for this.draw
                // Add cells to enqueue
                // Mark visited
                this.x = neighbor.x;
                this.y = neighbor.y;
                this.draw(x, y, this.shadeMap[1]);
                this.visited[this.y][this.x]++;
                ActionCreator.iterateSteps();
                // reset this.x and this.y for next neighbors
                this.x = x;
                this.y = y;
                cellsToEnqueue.push(neighbor);
            }
        }
        return cellsToEnqueue;

    },
// A* Related
    getAStarNeighbors: function(x, y) {
        let result = [];

        // set x y to this.x, this.y generate neighbor
        this.x = x;
        this.y = y;

        for (let i = 0; i < 4; i++) {
            let neighbor = this._getXYForDirection(i);
            if (neighbor.x >= 0 && 
                neighbor.y >= 0 && 
                this.isOpen(neighbor) &&
                !this.visited[neighbor.y][neighbor.x].closed) {
                    result.push(this.visited[neighbor.y][neighbor.x]);
            }
        }
        return result;
    },
// Wall Follower
    moveWithWall: function(point) {
        console.log("point!", point);
        let prevX = this.x,
            prevY = this.y;
        this.x = point.x;
        this.y = point.y;
        let shade = this.visited[this.y][this.x] > 0 ? this.shadeMap[2] : this.shadeMap[1];
        this.draw(prevX, prevY, shade);
        this.visited[this.y][this.x]++;
        ActionCreator.iterateSteps();
    },
// Tremaux
    // Given a point, check for any adjaceent unvisited paths
    findOpenPath: function (x, y) {
        let neighbors = [];

        // set x y to this.x, this.y generate neighbor
        this.x = x;
        this.y = y;

        for (let i = 0; i < 4; i++) {
            let neighbor = this._getXYForDirection(i);
            if (neighbor.x >= 0 && 
                neighbor.y >= 0 && 
                this.isOpen(neighbor) &&
                this.visited[neighbor.y][neighbor.x] === 0) {
                    neighbors.push(neighbor);
            }
        }
        return neighbors.length > 0 ? true : false;

    },
    backtrackWithTremaux: function () {
        let foundOpenPath = false,
            prevX = this.x,
            prevY = this.y;

        // If we are backtracking, make sure do not go to our current tile again, e.g. the one where we got stuck
        // So iterate it to 2
        this.visited[this.y][this.x]++;

        // Move to previous tile and draw to it and visit it
        let point = {x: this.xStack.pop(), y: this.yStack.pop()};
        this.stackSize--;
        prevX = this.x;
        prevY = this.y;
        this.x = point.x;
        this.y = point.y;
        this.draw(prevX, prevY, this.shadeMap[2]);
        this.visited[this.y][this.x]++;
        ActionCreator.iterateSteps();

        // If we can find an open path at this point, set it to 1 so we can backtrack on it
        // If we've found an open path while backtracking, 
        if (this.findOpenPath(point.x, point.y)) {
            foundOpenPath = true;
            this.visited[point.y][point.x]--;
            this.xStack.push(point.x);
            this.yStack.push(point.y);
            this.stackSize++;
        }
        return foundOpenPath;
    },
    moveWithTremaux: function(direction, backtrack) {
        let movedToNewTile = false,
            prevX = this.x,
            prevY = this.y,
            point = this._getXYForDirection(direction);

        if (this.outOfBounds(point) || !this.isOpen(point))  return movedToNewTile 

        if (backtrack) {
            // If we are backtracking, do not go to our current tile again, e.g. iterate it to 2
            this.visited[this.y][this.x]++;

            // Move to previous tile and draw to it
            point = Object.assign(point, {x: this.xStack.pop(), y: this.yStack.pop()});
            this.stackSize--;
            prevX = this.x;
            prevY = this.y;
            this.x = point.x;
            this.y = point.y;
            this.draw(prevX, prevY, this.shadeMap[2]);
            this.visited[this.y][this.x]++;
            ActionCreator.iterateSteps();


            // If we can find an open path at this point, set it to 1 so we can backtrack on it
            if (this.findOpenPath(point.x, point.y)) {
                movedToNewTile = true;
                this.visited[point.y][point.x]--;
                this.xStack.push(point.x);
                this.yStack.push(point.y);
                this.stackSize++;
            }
        } else {
            // check if our point is valid/ not visited
            if (this._unvisited(point) && this._canMoveWithTremaux(point)) {
                this.x = point.x;
                this.y = point.y;
                this.prevX = prevX;
                this.prevY = prevY;
                this.draw(prevX, prevY, this.shadeMap[1]);
                this.xStack.push(this.x);
                this.yStack.push(this.y);
                this.stackSize++;
                this.visited[this.y][this.x]++;
                movedToNewTile = true;
                ActionCreator.iterateSteps();
            }
        }
        return movedToNewTile;
    },

    updateConfig: function(mazeConfig) {
        this.mazeConfig = mazeConfig;
        this.generateVistedTilesModel();
    },
    _unvisited: function (point) {
        return this.visited[point.y][point.x] === 0; 
    },
    _canMoveWithTremaux: function(point) {
        return (!this.outOfBounds(point) && this.isOpen(point) && this.visited[point.y][point.x] < 2)

    },
    _isWall: function(x, y) {
        return (this.mazeConfig.maze[y][x] === 0);
    },
    isOpen: function(point) {
        return !this._isWall(point.x, point.y);
    },
    _hasVisited: function(direction) {
        let point = this._getXYForDirection(direction);

        // short circuiting here will prevent any TypeErrors
        return (this.outOfBounds(point) || this.visited[point.y][point.x] > 0)
    },
    outOfBounds: function(point) {
        return (point.y < 0 || 
                point.x < 0 ||
                this.visited[point.y] === undefined || 
                this.visited[point.y][point.x] === undefined)
    },
    // https://stackoverflow.com/questions/7348618/html5-canvas-clipping-by-color
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