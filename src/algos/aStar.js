import MazePathController from '../controller/mazeController';
import * as ActionCreator from '../actions/action-creator';

const aStar = {
    initialize: function (ctx, walker, mazeConfig) {
        this.ctx = ctx;
        this.walker = walker;
        this.mazeConfig = mazeConfig;
        this.start = new GraphNode(mazeConfig.start, mazeConfig.start, GraphNodeType.OPEN);
        this.end = new GraphNode(mazeConfig.end, mazeConfig.end, GraphNodeType.OPEN);
        this.openHeap = this.generateHeap();
        this.openHeap.push(this.start);
        this.initializeVisited();
    },
    step: function () {
        this.search();
    },
    search: function () {
        let currentNode,
            currentNodeNeighbors;

        if (this.openHeap.itemCount > 0) {
            currentNode = this.openHeap.pop()
            currentNode.closed = true;
            this.walker.x = currentNode.x;
            this.walker.y = currentNode.y;
            currentNodeNeighbors = this.walker.getAStarNeighbors(currentNode.x, currentNode.y);

            currentNodeNeighbors.forEach(neighbor => {
                let movementCostToNeighbor = currentNode.gCost + neighbor.cost,
                    previouslyVisited = neighbor.visited;

                if (movementCostToNeighbor < neighbor.g || !previouslyVisited) {
                    neighbor.visited = true;
                    neighbor.parent = currentNode;
                    neighbor.gCost = movementCostToNeighbor;
                    neighbor.hCost = this.manhattan([neighbor.x, neighbor.y], [this.end.x, this.end.y]);
                    neighbor.fCost = neighbor.gCost + neighbor.hCost;
                    this.walker.visited[neighbor.y][neighbor.x] = neighbor;
                    ActionCreator.iterateSteps();
                    // If we've already visited then we rescored an el and need to update it
                    if (!previouslyVisited) {
                        this.openHeap.push(neighbor);
                        this.walker.draw(neighbor.x, neighbor.y, this.walker.shadeMap[1]);
                    } else {
                        this.openHeap.updateItem(neighbor);
                    }
                }
            })
        }
    },
    initializeVisited: function () {
        // Iterate through maze from mazeConfig, updating walker.visited[y][x] to GraphNodes
        for (let y = 0; y < this.walker.maze.length; y++) {
            for (let x = 0; x < this.walker.maze.length; x++) {
                let point = {x: x, y: y};
                this.walker.visited[y][x] = new GraphNode(x, y, (this.walker.isOpen(point) ? GraphNodeType.OPEN : GraphNodeType.WALL));
            }
        }
    },
    generateHeap: function () {
        // generate a heap with our score function
        return new BinaryHeap(function (a, b) {
            if (a.fCost < b.fCost) return 1;
            if (a.fCost > b.fCost) return -1;
            return 0;
        })
    },
    // http://theory.stanford.edu/~amitp/GameProgramming/Heuristics.html
    manhattan: function (a, b) {
        let d1 = Math.abs(b[0] - a[0]),
            d2 = Math.abs(b[1] - a[1]);
        return d1 + d2;
    },
    isSolved: function () {
        return (this.walker.x === this.end.x && this.walker.y === this.end.y);
    },
    solve: function () {
        let currentCell = this.walker.visited[this.end.y][this.end.x],
            shortestPath = [[currentCell.x, currentCell.y]];
        while (true) {
            if (shortestPath[0][0] === this.start.x && shortestPath[0][1] === this.start.y) {
                break;
            } else {
                currentCell = currentCell.parent;
                shortestPath.unshift([currentCell.x, currentCell.y]);
            }
        }
        MazePathController.clearCanvas();
        this.walker.drawPath(shortestPath);
    }
}

const GraphNodeType = { OPEN: 1, WALL: 0}

class GraphNode {
    constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this.gCost = 0;
        this.hCost = 0;
        this.fCost = 0;
        this.cost = 10;
        this.visited = false;
        this.closed = false;
        this.parent = null;
        this.type = type;
    }
}

// Lower F-costs have a HIGHER priority and are thusly organized higher in the tree
class BinaryHeap {
    constructor(scoreFunction) {
        this.scoreFunction = scoreFunction;
        this.items = [];
        this.itemCount = 0;
    }

    push(el) {
        // Add el to the heap
        this.items[this.itemCount]= el;
        this.itemCount++;
        this.sortUp(this.itemCount - 1);
    }

    pop() {
        // Remove top of heap
        let el = this.items[0];
        this.itemCount--;
        // Property of heap, adding last-most el to top of heap
        this.items[0] = this.items[this.itemCount];
        // this.items = this.items.splice(-1, 1);
        this.items.splice(-1, 1);
        this.sortDown(0);
        return el;
    }

    count() {
        return this.itemCount;
    }

    contains(node) {
        return this.items.includes(node);
    }

    updateItem(node) {
        this.sortUp(this.items.indexOf(node))
    }

    sortDown(n) {
        let el = this.items[n],
            leftChildIndex,
            rightChildIndex,
            swapIndex;

        while (true) {
            leftChildIndex = n * 2 + 1;
            rightChildIndex = n * 2 + 2;
            // If there is a left child
            if (leftChildIndex < this.itemCount) {
                swapIndex = leftChildIndex;

                // If there is a right child
                if (rightChildIndex < this.itemCount) {
                    // If left child has a HIGHER f-cost than right child
                    if (this.scoreFunction(this.items[leftChildIndex], this.items[rightChildIndex]) < 0) {
                        swapIndex = rightChildIndex;
                    }
                }

                if (this.scoreFunction(el, this.items[swapIndex]) < 0) {
                    this.items[n] = this.items[swapIndex];
                    this.items[swapIndex] = el;
                    n = swapIndex;
                } else {
                    // correct position found, return
                    return;
                }
            } else {
                // no more children, also in correct position
                return;
            }
        }
    }
    sortUp(i) {
        let el = this.items[i],
        // Property of heap; subtract 1 to accomodate for 0 index
        // https://www.cs.cmu.edu/~adamchik/15-121/lectures/Binary%20Heaps/heaps.html
            parentIndex = Math.floor(i / 2),
            parentItem;
        while (true) {
            parentItem = this.items[parentIndex];

            if (this.scoreFunction(el, parentItem) > 0) {
                this.items[parentIndex] = el;
                this.items[i] = parentItem;
            } else {
                break;
            }
            i = parentIndex // update position of el
            if (parentIndex > 0) {
                parentIndex = Math.floor((i - 1) / 2); // calc new parent index
            }
        }
    }
}

export default aStar;