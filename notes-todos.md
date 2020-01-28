
<!-- TO DOs -->
<!--  
    - Iteration counter
        - Add for other algos
        - style
        - max out at a certain point
        - save functionality, etc
    - Maze destruction mode
        - randomly destroy walls
        - add sprite animation to each destruction
    - finalize styling
        - placement of maze
        - styling dropdowns
        - perhaps a larger maze
        - add labels to each size
        - info for each algo on what it's good for and diff maze selection styles
    - Info panel // add your name and github somewhere
    - README for github
    - sound
    - BUGS:
        - Alaska can repeat her phrases, make sure to not select the same one more than once in a row
        - ALSO, update to have more quotes



-->

## MazeController
What is this file intended to do?
- Provides the ctx, and mazeConfig to walker and algo
- Steps the algo through the maze by calling `step`, consistently checking if algo is done by using `setInterval`, also stores the token for that interval to cancel it
- Upon solution found, reveals solution path, removes the interval

On first render..
    - Initialize MazeController
        - save references to the mazeConfig, pathCtx, maze, speed
        - 




User selects Algo, then what?
- Action dispatched, "RUN_SCRIPT"
- MazeStore "RUN_SCRIPT":
    - Clear the Path canvas
    - Reset iterations (steps) count to 0
    - Clear timer



What does this need to do?




Implementation Notes:

**Walker - Algo - pathLayer - ???**
- Walker:
    - Called Within: pathLayer.jsx
    - keeps track of a maze representation, a current X,Y position, previous location, all visited cells (Array), a map of shades to color cells
    - traverses the maze, checking where it can and can't move, updating it's current location, and drawing accordingly, just a moving pencil

- Algo
    - 




**Cell Method Selection**
- Action: UPDATE_MAZE_GENERATION_CONFIG
- Effects:
    - MazeStore calls `MazeGenerator.redrawMaze()`, updates `MazeConfig` with new maze, emits sprite and change events
    - `maze.jsx` updates state with new MazeConfig, passed to both canvas layers
    - 







To Flux or not to Flux, all featuers and their needs:
Listener Events + Effects:
- Maze Generation Cell Method Selection
    - CLEAR CANVAS: `clearRect()`, function that can be called from MazeGenerator
    - REDRAW: `MazeGenerator.initialize` with new cell selection method
    - CLEAR TIMER: Clear all recorded times and stop any timer going
    - STOP WALKER: Stop any current maze walker
    - SPRITE ANIMATION: Trigger spite animation
    - triggers RESET CANVAS, UPDATE CANVAS (clears + redraws), SPRITE ANIMATION
- solver algo selection
    - CLEAR PATHS: clean up any paths made by walker on the canvas
    - NEW WALKER: instantiate a new walker and clear any previous walkers running

    - BEGIN/RESET TIMER: start a new timer with respective algo labeling
- maze completion
    - AFFIX TIME: record time to be saved/stop recording animation (CSS classes)

- What do we need to listen to ?
    - change events called from SELECT modules

- What do we need to store?
    - Maze
    - Times
    - 

ON INITIAL RENDER:
- Generate the maze, store it in the mazeStore
- draw the maze on the mazeLayer
- trigger wizard sprite
- provide information for our walker (e.g. mazeObject)
    - includes width, height, maze, start, end



Algos to implement
- A*
- Tremaux
- Wall follower
- Dijkstra
- 


We need to draw our maze! What are the moving pieces here:
- A user input that determines the heurestic for drawing the maze
- A maze component itself that not only can represent the maze in a format we can work with for our algo, but also that can be used to represent it on the canvas easily
- We also need to represent the traversal of said maze, most likely using a walker we can give to our various algos



**To Add**
Intro Page:
- <Modal>-like component that contains the <Ship> component and listens for clicks, it will remove itself from the DOM once it is clicked or with a key press
- <Ship> component which will show the ship, it will have some sort of internal timing mechanism that will iterate it as it moves across the page, perhaps an additional speech bubble for funsies
- Be sure to have intro copy

Maze Generation:
- Pull algo from what you saved and start actualyy manipualting the canvas
- I believe you'll have to do a `moveTo` every time we select a new cell to make sure we are moving our cursor to a new place





### HTML5 Canvas Introduction
Four essential skills for any HTML5 Canvas piece:
- Creating and resizing your canvas
- Drawing elements
- Animating elements
- Interacting with elements


- Use the `<canvas>` tag to add a canvas to the DOM
- Once we have selected the canvas element in a JS file, we can get the context from the canvas:
```javascript
const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');
// we are returning a drawing context which provides a super-object with a bunch of methods and functionality we can use to draw within our canvas

// Note that we can make our canvas the entire width/height of the page by setting the width and height of the canvas to window.innerWidth/innerHeight
```

Canvas objects:
- Rects
- Lines
- Arcs / Circles
- Bezier curves
- Images
- Text

Drawing a line:
```javascript
c.beginPath()
c.moveTo(50, 300); // (x, y) this point is invisible until we call the stroke method
c.lineTo(300, 100);
// We can add more c.lineTo to create more lines
c.lineTo(400, 300);
c.strokeStyle = "hex // rgba() // css preset color"; // for shapes we can do fillStyle()
// To change the fill/stroke style of preceeding lines or shapes, we simply update the fillStyle before adding them
c.stroke();
```

Drawing an arc / circle : 
```javascript
c.beginPath(); // We must start with beginPath otherwise whatever follows will be connected to what was previously drawn
c.arc() // x , y , radius, startAngle (in radians), endAngle, drawCounterclockwise (Bool)
c.arc(300, 300, 30, 0, Math.PI * 2, false); // an outline for an arc
c.stroke();
```

Sidenote Radians: An alternate way of measuring angles
- Given a circle and an angle of one radian, the arc that subtends it is exactly one radius long
- Therefore, a 360 degree angle can be represented in radians as 2 pi radians and one radian

We can use a for loop to draw multiple shapes on the canvas at once, using some radomization factor such as
`var x = Math.random() * window.innerWidth...`

How can we move an object around while also creating a reusable structure do we can have as many
objects as we want moving on the canvas? OOP!
```javascript
function Circle(x, y, dx, dy, radius) {
    this.x = x;
    this.y = y;
    this.dx = dx // velocity
    this.dy = dy;
    this.radius = radius;

    this.draw = function() {
        c.beginPath();
        c.arc(x, y, radius, 0, Math.PI * 2, false);
        c.strokeStyle = 'blue';
        c.stroke();
    }

    this.update = function() {
        if (x + radius > innerWidth || x - radius < 0) {
            this.dx = -this.dx;
        }

        if (y - this.radius > innerHeight || y - radius < 0) {
            this.dy = -this.dy;
        }

        this.x += this.dx; // update new positions
        this.y += this.dy;

        this.draw() // redraw after updating
    }

}

const circle = new Circle(200, 200, 3, 3, 30);

function animate() {
    requestAnimationFrame(animate);
    c.clearRect(0, 0, innerWidth, innerHeight);
    circle.update();
}

// We can create a bunch of new circles
var circleArray = [];
for (let i = 0; i < 100; i++) {
    let x = Math.random() * (innerWidth - radius * 2) + radius; // prevents circles getting caught
    let y = Math.random() * innerHeight;
    let dx = (Math.random() - 0.5) * 8;
    ...
    circleArray.push(new Circle(...))
}
```



