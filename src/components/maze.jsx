import React from 'react';
import MazeStore from '../stores/maze-store';

// For addressing varying pixel ratios in displays
// Doesn't seem necessary but maybe can be incorporated
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

class Maze extends React.Component {
    constructor(props) {
        super(props);
        this.onChange = this.onChange.bind(this);
        this.state =  getMazeConfigState();
    };

    componentDidMount() {
        MazeStore.saveCanvasContexts({pathContext: this._pathCtx, mazeContext: this._mazeCtx});
        MazeStore.createMaze();
        // We aren't doing any component-level interactins with the store that would provide the ctx so we can have to manually provide it
        // we may not even need this line since MazeStore is emitting a chance once the maze is drawn
        //  WalkerManager.initialize(this._pathCtx, this.state.mazeConfig);
    };

    // No binding required
    saveContext = (ctx, label) => {
        label === "maze-layer" ? this._mazeCtx = ctx : this._pathCtx = ctx;
    };

    onChange() {
        this.setState(getMazeConfigState());
    };

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
        );
    };
};

class PureCanvas extends React.Component {
    shouldComponentUpdate() {
      return false;
    };

    render() {
        return (
        <canvas
            id={this.props.label}
            width={this.props.canvasWidth}
            height={this.props.canvasHeight}
            ref={node => node ? this.props.contextRef(node.getContext('2d'), this.props.label) : null }
        />
        );
    };
};

export default Maze;