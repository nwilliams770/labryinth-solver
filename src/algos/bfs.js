import MazeStore from '../stores/maze-store';
import MazePathController from '../controller/mazeController';

const bfs = {
    // Walker will track:
    //      visited
    initialize: function (ctx, walker, mazeConfig) {
        this.ctx = ctx;
        this.walker = walker;
        this.mazeConfig = mazeConfig;
        // For 10-path x 10-path maze
        this.end = {x: mazeConfig.end, y: mazeConfig.end};
        this.nodesLeftInLayer = 1; // our start
        this.nodesInNextLayer = 0;

        // Instead of storing a pair of coords in a single array, which requires a wrapper and a lot of unpacking
        //  We can store each dimension in a separate array
        this.rowQueue = [0];
        this.colQueue = [0];
        this.visitedPaths = [];
        this.endFound = false;
        this.moves = 0;
    },
    step: function () {
        let y = this.colQueue.shift(),
            x = this.rowQueue.shift();

        if (this.foundEnd(x, y)) {
            this.endFound = true;
            // maybe return here?
        }
        
        let cellsToEnqueue = this.walker.visitAndEnqueueNeighbors(x, y);
        this.processCells(cellsToEnqueue, {x: x, y: y});
        this.nodesLeftInLayer--;

        if (this.nodesLeftInLayer === 0) {
            this.nodesLeftInLayer = this.nodesInNextLayer;
            this.nodesInNextLayer = 0;
            this.moves++;
            // iterate step count here if we want the length of the shortest path
            // if we want EVERY step taken, do it in process cells

        }
    },
    processCells: function(cells, startingCell) {
        cells.forEach(cell => {
            this.nodesInNextLayer++;
            this.colQueue.push(cell.y);
            this.rowQueue.push(cell.x);
            this.visitedPaths.unshift([[startingCell.x, startingCell.y], [cell.x, cell.y]]);
        });
    },
    foundEnd: function(x, y,) {
        return this.end.x === x && this.end.y === y
    },
    isSolved: function() {
        return this.endFound;
    },
    solve: function() {
        let currentCell = [this.end.x, this.end.y],
            shortestPath = [currentCell];
        while (this.visitedPaths.length > 0) {
            let possiblePath = this.visitedPaths.shift();
            if (possiblePath[1][0] === currentCell[0] && 
                possiblePath[1][1] === currentCell[1]) {
                    currentCell = possiblePath[0];
                    shortestPath.unshift(possiblePath[0]);
            }
        };

        MazePathController.clearCanvas();
        this.walker.drawPath(shortestPath);
    }
};

export default bfs;