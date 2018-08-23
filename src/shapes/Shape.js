import Cute from '../lib/cute'
const Shape = Cute({
    render() {
        switch (this.props.info) {
            case 0: {
                console.log(this.props.info)
                return (
                    //This is an arc/circle
                    <path>
                        <arc x={this.props.xPos} y={this.props.yPos} r={40} sa={0} ea={2 * Math.PI} ccw={false} />
                        <fill color={this.randomColor()} />
                        <stroke color={this.randomColor()} />
                    </path>
                )
            }
            case 1: {
                console.log(this.props.info)
                return (
                    //This is arc-to
                    <path>
                        {/* <move x={this.props.xPos - 50} y={this.props.yPos - 50} /> */}
                        <line x={this.props.xPos - 50} y={this.props.yPos - 50} />
                        <arc-to x={this.props.xPos + 50} y={this.props.yPos - 50} x2={this.props.xPos + 50} y2={this.props.yPos + 50} r={40} />
                        <line x={this.props.xPos + 50} y={this.props.yPos} />
                        <close-path />
                        {/* <fill color={this.randomColor()} /> */}
                        <stroke color={this.randomColor()} />
                        {/* <fill-rect x={this.props.xPos} y={this.props.yPos} w={10} h={10} color={"orange"} /> */}
                    </path>
                )
            }
            case 2: {
                console.log(this.props.info);
                return (
                    <path>
                        {/* Lines don't seem to work properly after being paced after an arc-to BUT it works in case 4, after a square is placed before it. Something is wrong with line/bezier-curve/arc-to/quad-curve and maybe move.*/}
                        {/* --- */}
                        {/* Trying to make a triangle */}
                        {/* --- */}
                        {/* <move x={this.props.xPos - 50} y={this.props.yPos - 50} /> */}
                        <line x={this.props.xPos - 50} y={this.props.yPos} />
                        <line x={this.props.xPos} y={this.props.yPos} />
                        {/* <close-path /> */}
                        <stroke color={"black"} />

                        {/* This works, though */}
                        {/* --- */}
                        {/* <fill-rect x={this.props.xPos} y={this.props.yPos} w={20} h={20} color={"blue"} /> */}
                    </path>
                )
            }
            case 3: {
                console.log(this.props.info);
                return (
                    //This is a square
                    <path>
                        <fill-rect x={this.props.xPos} y={this.props.yPos} w={10} h={10} color={"red"} />
                    </path>
                )
            }
            case 4: {
                console.log(this.props.info);
                return (
                    <path>
                        {/* It seems to work here! */}
                        {/* --- */}
                        <move x={this.props.xPos - 50} y={this.props.yPos - 50} />
                        <line x={this.props.xPos - 50} y={this.props.yPos} />
                        <line x={this.props.xPos} y={this.props.yPos} />
                        <close-path />
                        <stroke color={"black"} />
                    </path>
                )
            }
        }
    },
    methods: {
        randomColor() {
            return '#' + Math.floor(Math.random() * 16777215).toString(16)
        }
    }
})

export default Shape