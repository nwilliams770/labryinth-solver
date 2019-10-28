import React from 'react';
import MazeStore from '../../stores/maze-store';
import MazeLayer from './maze_layer';
import PathLayer from './path_layer';
import WalkerManager from '../../walker/walker';


// What are the potential state changes:
//  User selects different heurestic for maze generation
//  User selects new algo to solve maze

// To be moved to helper
const getPixelRatio = (ctx) => {
    let backingStore =
    ctx.backingStorePixelRatio ||
    ctx.webkitBackingStorePixelRatio ||
    ctx.mozBackingStorePixelRatio ||
    ctx.msBackingStorePixelRatio ||
    ctx.oBackingStorePixelRatio ||
    1;
    return (window.devicePixelRatio || 1) / backingStore;
};

const getMazeConfigState= () => {
    return { mazeConfig: MazeStore.getMazeConfig() }
};

// So it looks like the problem here is that we need to mount the canvases / get their references in order to 
// provide the context to MazeGenerator
// It seems like, based on the order of console.logs, that MazeStore is emitting a change before the 
// eventListener can be mounted, so the state is never really updating

// Ultimatly, it looks like this is the order of actions/things happening:
// maze_layer mounts, calls Store to genreate Maze
// store is updated, emits event before maze.jsx is mounted
// maze.jsx mounts, 

// Our maze_layer, AND path_layer both should just be pure canvas components, who have refs hoisted
// up to maze so that we can generate the maze/initialize the walker all in the parent
// https://hackernoon.com/techniques-for-animating-on-the-canvas-in-react-d0e9fd53e9da
// https://stackoverflow.com/questions/49786505/what-is-correct-lifecycle-method-in-react-16-3-to-update-canvas-from-props/49803151#49803151
// ^ these look promising for doing so




class Maze extends React.Component {
    constructor(props) {
        super(props);
        this.onChange = this.onChange.bind(this);
        this.state =  getMazeConfigState();

    }

    componentDidMount() {
        MazeStore.addChangeListener(this.onChange);
        MazeStore.generateInitialMaze(this._mazeCtx);
    // we may not even need this line since MazeStore is emitting a chance once the maze is drawn     
    //  WalkerManager.initialize(this._pathCtx, this.state.mazeConfig); 
    }

    componentWillUnmount() {
        MazeStore.removeChangeListener(this.onChange);
    }

    // Don't have to bind this in this format
    saveContext = (ctx, label) => {
        label === "maze-layer" ? this._mazeCtx = ctx : this._pathCtx = ctx;
    }

    onChange() {
        console.log("change happened!")
        this.setState(getMazeConfigState());
        console.log(this.state.mazeConfig)
        WalkerManager.initialize(this._pathCtx, this.state.mazeConfig);
    }

    render() {
        return (
            <div id="maze">
                <div className="wrapper">
                    <PureCanvas 
                        canvasWidth={this.state.mazeConfig.canvasWidth}
                        canvasHeight={this.state.mazeConfig.canvasHeight}
                        label={"path-layer"}
                        contextRef={this.saveContext}
                    />
                    <PureCanvas 
                        canvasWidth={this.state.mazeConfig.canvasWidth}
                        canvasHeight={this.state.mazeConfig.canvasHeight}
                        label={"maze-layer"}
                        contextRef={this.saveContext}
                    />
                </div>
            </div>
        )
    }
}

class PureCanvas extends React.Component {
    shouldComponentUpdate() {
      return false;
    }
  
    render() {
        console.log("this.props", this.props);
        return (
        <canvas
            id={this.props.label}
            width={this.props.canvasWidth}
            height={this.props.canvasHeight}
            ref={node => node ? this.props.contextRef(node.getContext('2d'), this.props.label) : null }
        />
        );
    }
}


// const Maze = () => {
//     let mazeConfig = getMazeConfigState();
//     console.log("initial mazeConfig state in maze.jsx");
//     console.log(mazeConfig);
//     console.log(mazeConfig.test);

//     const [mazeConfigState, updateMazeConfigState] = useState(mazeConfig);

//     // const onChange = () => {
//     //     console.log("onChange called in maze.jsx: new maze config state...");
//     //     updateMazeConfigState(getMazeConfigState());
//     // }

//     const onChange = useCallback((event) => {
//         console.log("onChange called in maze.jsx: new maze config state...");
//         updateMazeConfigState(getMazeConfigState());
//     }, []);


//     useEffect(() => {
//         MazeStore.addChangeListener(onChange)
//         console.log("useEffect has been called in maze.jsx, new mazeConfigState");
//         console.log(mazeConfigState);
//         console.log(mazeConfigState.test);

//         // let ratio = getPixelRatio(ctx),
//         //     width = getComputedStyle(canvas)
//         //         .getPropertyValue('width')
//         //         .slice(0, -2),
//         //     height = getComputedStyle(canvas)
//         //         .getPropertyValue(canvas)
//         //         .slice(0, -2);
//         // canvas.width = width * ratio;
//         // canvas.height = height * ratio;
//         // canvas.style.width = `${width}px`;
//         // canvas.style.height = `${height}px`;
//         // WalkerManager.initialize(null, mazeConfig);

//         return function() {
//             MazeStore.removeChangeListener(onChange)
//         }
//     }, [])

//     return (
//         <div id="maze">
//             <div className="wrapper">
//                 <PathLayer mazeConfig={mazeConfigState} />
//                 <MazeLayer mazeConfig={mazeConfigState} />
//             </div>
//         </div>
//     )
// }


export default Maze;