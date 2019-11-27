// We are using a rotation matrix to determine the relative directions no matter which direction
// Because we are rotating about our own walker as opposed to the origin, our vector size is of length 1
// We are also using a kind of zero-point mechanism to determine how many degrees for our rotation matrix
    // East: 0 degrees
    // North: 90 degrees
    // West: 180 degrees
    // South: 270 degrees

const wallFollower = {
    // In this implementation, leaning towards the left
    initialize: function (ctx, walker, mazeConfig) {
        this.ctx = ctx;
        this.walker = walker;
        this.mazeConfig = mazeConfig;
        // For 10-path x 10-path maze
        this.end = {x: 18, y: 18};
        this.currentDirection = 1.5 * Math.PI; // we want to start facing South e.g 270 deg;
    },
    step: function () {
        let point = this.canMoveLeft(this.currentDirection);
        // Move left anytime we can
        if (point) {
            console.log("moving left")
            this.walker.moveWithWall(point);
            this.rotateLeftNinety();
        } 
        
        // Move forward if possible
        point = this.canMoveForward(this.currentDirection);
        if (point) {
            console.log("moving forward")

            this.walker.moveWithWall(point);
        } else {
            // If we can't move left or forward, we may be in some corner where we can only turn right
            // But if we can't turn right, we're in a deadend and need to turn around
            point = this.canMoveRight(this.currentDirection);
            if (point) {
                console.log("moving right")

                this.walker.moveWithWall(point);
                this.rotateRightNinety();

            } else {
                console.log("moving backward")

                point = this.backTrack();
                this.walker.moveWithWall(point);
                // Do a 180
                this.rotateLeftNinety();
                this.rotateLeftNinety();
            }
        }

    },
    backTrack: function () {
        // Backward at 0 deg is x -1
        let x = -1,
            y = 0,
            theta = this.currentDirection,
            relativeBackwardTileVector = this.rotate(x, y, theta), // coordinates for the relative left tile
            relativeBackwardTile = [this.walker.x + relativeBackwardTileVector[0], this.walker.y + relativeBackwardTileVector[1]];
            return relativeBackwardTile;
    },
    canMoveLeft: function () {
        // Left at 0 deg is y -1
        let x = 0,
            y = -1,
            theta = this.currentDirection,
            relativeLeftTileVector = this.rotate(x, y, theta), // coordinates for the relative left tile
            relativeLeftTile = [this.walker.x + relativeLeftTileVector[0], this.walker.y + relativeLeftTileVector[1]];

        let result = (relativeLeftTile[0] >= 0 && relativeLeftTile[1] >= 0 && this.walker._isOpen(relativeLeftTile[0], relativeLeftTile[1])) ? relativeLeftTile : false;
        return result;
    },
    canMoveForward: function () {
        // Forward at 0 deg is x + 1
        let x = 1,
            y = 0,
            theta = this.currentDirection,
            relativeForwardTileVector = this.rotate(x, y, theta), // coordinates for the relative forward tile
            relativeForwardTile = [this.walker.x + relativeForwardTileVector[0], this.walker.y + relativeForwardTileVector[1]];
            
            let result = (relativeForwardTile[0] >= 0 && relativeForwardTile[1] >= 0 && this.walker._isOpen(relativeForwardTile[0], relativeForwardTile[1])) ? relativeForwardTile : false;
            return result;
    },
    canMoveRight: function () {
        // Right at 0 deg is y + 1
        let x = 0,
            y = 1,
            theta = this.currentDirection,
            relativeRightTileVector = this.rotate(x, y, theta), // coordinates for the relative right tile
            relativeRightTile = [this.walker.x + relativeRightTileVector[0], this.walker.y + relativeRightTileVector[1]];

            let result = (relativeRightTile[0] >= 0 && relativeRightTile[1] >= 0 && this.walker._isOpen(relativeRightTile[0], relativeRightTile[1])) ? relativeRightTile : false;
            return result;
    },
    rotate: function (x, y, theta) {
    // rotation matrix
    // https://en.wikipedia.org/wiki/Rotation_matrix
    
        let matrix = [
                [  Math.cos(theta), Math.sin(theta)],
                [ -Math.sin(theta), Math.cos(theta)]
            ],
            x1 = (x * matrix[0][0]) + (y * matrix[0][1]),
            y1 = (x * matrix[1][0]) + (y * matrix[1][1]);
        
        return [Math.round(x1), Math.round(y1)];

    },
    rotateLeftNinety: function () {
        // Add 90 deg then wrap to 360 for debugging purposes
        this.currentDirection = (this.currentDirection + (Math.PI / 2.0)) % (2 * Math.PI);
    },
    rotateRightNinety: function () {
        // Subtract 90 deg then wrap to 360 for debugging purposes
        this.currentDirection = (this.currentDirection - (Math.PI / 2.0) + (2 * Math.PI)) % (2 * Math.PI);
    },
    isSolved: function() {
        return (this.walker.x === this.end.x && this.walker.y === this.end.y);
    },
    solve: function() {
        this.walker.removeColor([201,64,133]);
    }
};

export default wallFollower;