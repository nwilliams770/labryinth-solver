## Tremaux e.g. Depth-first Search
- Traverse the maze marking each visited cell
- When coming to a junction, always prefer a non-visited or least-visited cell over a visited one
- Cardinal rule is to **never** traverse an already twice-traversed path
Pseudocode:
    if (walker.canMove(direction)) {
        walker.drawToCanvas();
        walker.updateCurrentPoint();
        walker.addCellToVisited();
    } else {
        direction++ OR a different means of updating direction
    }

    if (mazeSolved()) {
        drawSolutionPath() // draw every cell that has a value of 1
    }


## Wall-follower
### Transforming Vectors using Matrices:
- Can we multiply a 2 x 2 matrix by a column vector (e.g. 2 x 1 matrix). We can perform matrix multiplication if first matrices num columns equals second matrices num rows and will result in matrix with num rows as first matrix and num columns as the second



- Envision we are in the maze, pick a wall to our left or right to follow, whichever wall our 'hand' is following, is the direction we prefer to go
- For example, if we are following the right wall:
    if (walker.canGo("right")) {
        ***iterate value on tile; making sure we are painting the right color if we backtrack***
        
    } elsif (walker.canGo("forward")) {
        ***iterate value on tile; making sure we are painting the right color if we backtrack***

    } elsif (walker.canGo("left")) {
        ***iterate value on tile; making sure we are painting the right color if we backtrack***

    } elsif (waker.canGo("backward")) {
        ***iterate value on tile; making sure we are painting the right color if we backtrack***

    }

## A*

## Breadth-first-search
- This is NOT Dijkstra's algorithm because Dijkstra is concerned with edge costs, e.g. costs to traverse between nodes
- 


## A*
- We have to create a node struct to store whether it's open or closed, and it's g (how far away node is from starting node) and h (heurestic: distance to goal) costs, f cost (g + h cost)
OPEN, CLOSED arrays:
    - Open is a list of nodes for which we have already calculated f cost
    - Closed list is for nodes that have already been evaluated/visited (had all their neighbors added)

    add starting node to OPEN array

    loop:
    current = node in OPEN with lowest f-cost
    remove current from OPEN and add it to CLOSED

    check for target
    if current node is target // we found a path
        return

    forEach neighbor of current node
        if neighbor is not traverseable (a wall or off the grid) or neighbor is in CLOSED
            skip to next neighbor
        
        if new path to neighbor is shorter (already in OPEN list but this new path is shorter) OR neighbor is not in OPEN
            set f_cost of neighbor
            set parent of neighbor to current
            if neighbor is not in OPEN
                add neighbor to open