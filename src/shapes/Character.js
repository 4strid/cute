import Cute from '../lib/cute'
const Character = Cute({
    render() {
        return (
            <path>
                <fill-rect x={this.props.xPos - 300} y={this.props.yPos} w={10} h={10} color={"black"} />
                <move x={this.props.xPos} y={this.props.yPos} />
                <bezier-curve
                    cp1x={this.props.xPos - 100} cp1y={this.props.yPos - 50}
                    cp2x={this.props.xPos + 200} cp2y={this.props.yPos}
                    x={this.props.xPos + 100} y={this.props.yPos + 100}
                />
                <line x={Cute.canvas.width - 10} y={this.props.yPos + 200} />
                <quad-curve
                    cpx={this.props.xPos - 300} cpy={this.props.yPos}
                    x={this.props.xPos - 100} y={this.props.yPos - 100}
                />
                <stroke color={"pink"} />
            </path>
        )
    }
})

export default Character