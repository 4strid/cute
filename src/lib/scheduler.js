function Scheduler (ctx, screen) {
	// i don't like leaking the ctx into this file
	// but not sure where else to put it
	this.ctx = ctx
	this.screen = screen
}

Scheduler.prototype.render = function () {
	const elements = screen.zList()
	for (const element of elements) {
		element._render(this.ctx)
	}
}
