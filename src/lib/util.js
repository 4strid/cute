import Constructor from './constructor'

const renderElement = (ctx, element) => {
	if (element instanceof Constructor) {
		return element._render(ctx)
	}
	element(ctx)
}

export { renderElement }
