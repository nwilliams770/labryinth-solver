import { thisExpression } from "@babel/types";

const aStar = {
    initialize: function (ctx, walker, mazeConfig) {
        this.ctx = ctx;
        this.walker = walker;
        this.mazeConfig = mazeConfig;
        // For 10-path x 10-path maze
        // this.end = {x: 18, y: 18};
        this.isSolved = false;
        this.start = new GraphNode(0, 0, GraphNodeType.OPEN);
        this.end = new GraphNode(18, 18, GraphNodeType.OPEN);
        this.openHeap = this.heap();
        this.openHeap.push(start);
    },
    initializeVisited: function () {
        // Iterate through maze from mazeConfig, updating walker.visited[y][x] to the GraphNode
        for (let y = 0; y < this.walker.maze.length; y++) {
            for (let x = 0; x < this.walker.maze.length; x++) {
                this.walker.visited[y][x] = new GraphNode(x, y, (this.walker._isOpen(x, y) ? GraphNodeType.OPEN : GraphNodeType.WALL));
            }
        }
    },

    heap: function () {
        return new BinaryHeap(function (a, b) {
            if (a.fCost < b.fCost) return 1;
            if (a.fCost > b.fCost) return -1;
            return 0;
        })
    },

    step: function () {

    },
    search: function () {
        let currentNode,
            currentNodeNeighbors;
        // loop
            currentNode = this.openHeap.pop()
            currentNode.closed = true;
            this.walker.x = currentNode.x;
            this.walker.y = currentNode.y;

            if (currentNode.x === this.end.x && currentNode.y === this.end.y) {
                // this.solve
            }

            currentNodeNeighbors = this.walker.getValidNeighbors(currentNode.x, currentNode.y);
            currentNodeNeighbors.forEach(neighbor => {
                let movementCostToNeighbor = currentNode.g + neighbor.cost,
                    previouslyVisited = neighbor.visited;

                // if (movementCostToNeighbor < neighbor.g || !neighbor.visited)
                if (movementCostToNeighbor < neighbor.g || !previouslyVisited) {
                    neighbor.visited = true;
                    neighbor.parent = currentNode;
                    neighbor.gCost = movementCostToNeighbor;
                    neighbor.hCost = this.manhattan([neighbor.x, neighbor.y], [this.end.x, this.end.y]);
                    neighbor.fCost = neighbor.gCost + neighbor.hCost;


                    // If we've already visited then we rescored an el and need to update it
                    if (!previouslyVisited) {
                        this.openHeap.push(neighbor);
                        this.walker.draw(neighbor.x, neighbor.y, this.walker.shadeMap[1]);
                    } else {
                        this.openHeap.updateItem(neighbor);
                    }
                }
            })


    },

    manhattan: function (a, b) {
        let d1 = Math.abs(b[0] - a[0]),
            d2 = Math.abs(b[1] - a[1]);
        return d1 + d2;
    }
}

const GraphNodeType = { OPEN: 1, WALL: 0}

class GraphNode {
    constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this.gCost = 0;
        this.hCost = 0;
        this.cost = 10;
        this.visited = false;
        this.closed = false;
        this.parent = null;
        this.type = type;
    }

    fCost() {
        return this.gCost + this.hCost;
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
            leftChildIndex = n * 2 + 1,
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
            parentIndex = i / 2,
            parentItem;
        while (true) {
            parentItem = this.items[parentIndex];
            // Score function should be structured as follows for usability
            // function (a, b) {
            //      if (a.fCost < b.fCost) {
            //          return 1;
            //    } elsif (a.fCost > b.fCost) {
            //          return -1;
            //}     else { return 0}
            // }
            if (this.scoreFunction(el, parentItem) > 0) {
                this.items[parentIndex] = el;
                this.items[i] = parentEl;
            } else {
                break;
            }
            i = parentIndex // update position of el
            parentIndex = (i - 1) / 2 // calc new parent index
        }
    }
}

export default aStar;