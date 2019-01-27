`
const App = Cute({
	render() {
		const { bodies, colors, scale, offset } = this.data;
		console.log(bodies);
		return (
			<layer>
				<text font='Arial' fill='blue' x={50} y={50}>
          Look ma it's text
        </text>
			</layer>
		)
	},
})

Cute.attach(
	<App />,
	document.querySelector('.cute-app'),
	1000,
	1000
)
`

const maybeSrc = window.localStorage.getItem('saved')

const editor = document.querySelector('.src pre code')
editor.innerText = maybeSrc || src
editor.addEventListener('input', compile)
editor.addEventListener('keydown', insertTab)
editor.contentEditable = true

const saveBtn = document.querySelector('button')
saveBtn.addEventListener('click', () => window.localStorage.setItem('saved', editor.innerText))

let app = null

compile({target: { innerText: editor.innerText }})

function insertTab (evt) {
	console.log(evt)
	if (evt.key === 'Tab') {
		evt.preventDefault()
		document.execCommand('insertHTML', false, '&#009')
	}
	return false
}

function compile (evt) {
	const src = evt.target.innerText

	const compiled = Babel.transform(src, {
		presets: ['es2015'],
		plugins: [[
			'transform-react-jsx', {
				'pragma': 'Cute.createElement',
			},
		],
		'transform-object-rest-spread',
		],
	}).code

	document.querySelector('.cute-app').innerHTML = ''

	app = eval(compiled)
}
