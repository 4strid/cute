// import Cute from '../../lib/cute'
// const OtherCharacter = Cute({
//     render() {
//         return (
//             <path>
//                 {/* WHAT I HAVE TO DO TO MAKE IT WORK */}
//                 <fill-rect x={this.props.xPos - 100} y={this.props.yPos - 50} w={10} h={10} color={"gray"} />
//                 {/* square indicating where my second control point is cp2x, cp2y */}
//                 <fill-rect x={this.props.xPos + 200} y={this.props.yPos} w={10} h={10} color={"gray"} />
//                 <move x={this.props.xPos} y={this.props.yPos} />
//                 <bezier-curve
//                     cp1x={-100} cp1y={-50}
//                     cp2x={200} cp2y={0}
//                     x={this.props.xPos + 100} y={this.props.yPos + 100}
//                 />
//                 <stroke color={"yellow"} />
//             </path>
//         )
//     }
// })

// export default OtherCharacter