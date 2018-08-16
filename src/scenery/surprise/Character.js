import Cute from '../../lib/cute'
const Character = Cute({
    render() {
        return (
            <path>
                {/* TRYING TO DO IT LIKE HTML CANVAS */}
                {/* square indicating where my first control point is cp1x, cp1y */}
                <fill-rect x={this.props.xPos - 100} y={this.props.yPos - 50} w={10} h={10} color={"black"} />
                {/* square indicating where my second control point is cp2x, cp2y */}
                <fill-rect x={this.props.xPos + 200} y={this.props.yPos} w={10} h={10} color={"black"} />
                <move x={this.props.xPos} y={this.props.yPos} />
                <bezier-curve
                    cp1x={this.props.xPos - 100} cp1y={this.props.yPos - 50}
                    cp2x={this.props.xPos + 200} cp2y={this.props.yPos}
                    x={this.props.xPos + 100} y={this.props.yPos + 100}
                />
                <stroke color={"pink"} />
            </path>
        )
    }
})

export default Character