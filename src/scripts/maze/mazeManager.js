const MazeManager = {
    grid: null,

    DIRECTION: {
        N: 1,
        S: 2,
        E: 3,
        W: 4
    },
    DX: {
        E: 1,
        W: -1,
        N: 0,
        S: 0
    },
    DY: {
        E: 0,
        W: 0,
        N: -1,
        S: 1
    },
    OPPOSITE: {
        E: "W",
        W: "E",
        N: "S",
        S: "N",
    },

    initialize: function(width=2, height=2, cellSelectionMethod='ramdom') {
        this.grid = new Array(width * height).fill(0);

        this.growTree(width, height, cellSelectionMethod)
    },

    _growTree: function(width, height, cellSelectionMethod) {
        let x = this._getRandomIndex(0, width - 1),
            y = this._getRandomIndex(0, height - 1),
            active = [],
            index;

        active.push([x, y])

        while (active.length > 0) {
            index = _nextIndex(active.length, cellSelectionMethod)
        }
    },

    _nextIndex: function(length, cellSelectionMethod) {
        switch (cellSelectionMethod) {
            case ('random'):
                
        }

    }
    
    // getRandomIntInclusive() from MDN
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
    _getRandomIndex(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive 
    },
}

MazeManager.initialize();

// console.log(MazeManager.initialize);