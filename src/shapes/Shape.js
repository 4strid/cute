import Cute from '../lib/cute'
const Shape = Cute({
    render () {
		console.log(this.props.info);
		console.log(this.x, this.y);
        switch (this.props.info) {
            case 0: {
                console.log('circle')
                return (
                    //This is an arc/circle
                    <path>
                        <arc x={0} y={0} r={40} sa={0} ea={2 * Math.PI} ccw={false} />
                        <fill color={this.randomColor()} />
                        <stroke color={this.randomColor()} />
                    </path>
                )
            }
            case 1: {
                console.log('arc-to shape')
                return (
                    //This is arc-to
                    <path>
                        <move x={0} y={0} />
                        <arc-to x1={150} y1={0} x2={0} y2={150} r={25} />
                        <close-path />
                        <fill color={this.randomColor()} />
                        <stroke color={this.randomColor()} />
                    </path>
                )
            }
            case 2: {
                console.log('triangle')
                return (
                    <path>
                        <move x={0} y={-60} />
                        <line x={45} y={45} />
                        <line x={-45} y={45} />
                        <close-path />
                        <stroke color={this.randomColor()} />
						<fill color={this.randomColor()} />
                    </path>
                )
            }
            case 3: {
                console.log('square')
                return (
                    //This is a square
                    <path>
						<rect x={-25} y={-25} w={50} h={50} />
						<fill color={this.randomColor()} />
						<stroke color={this.randomColor()} />
                    </path>
                )
            }
            case 4: {
                console.log('triangle again')
                return (
                    <path>
                        <move x={0} y={-60} />
                        <line x={45} y={45} />
                        <line x={-45} y={45} />
                        <close-path />
                        <stroke color={this.randomColor()} />
						<fill color={this.randomColor()} />
                    </path>
                )
            }
        }
    },
    methods: {
        randomColor () {
            const hex = Math.floor(Math.random() * 0xffffff + 1).toString(16)
			return '#' + '0'.repeat(6 - hex.length) + hex
        }
    }
})

export default Shape
