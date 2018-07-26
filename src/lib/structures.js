function MultiMap () {
	this.constructorMap = new Map ()
}

MultiMap.prototype.get = function (component) {
	const componentMap = this.constructorMap.get(component.constructor)
	return componentMap.get(component)
}

MultiMap.prototype.set = function (component, value) {
	const componentMap = this.constructorMap.get(component.constructor) || new Map()
	this.constructorMap.set(component.constructor, componentMap)
	componentMap.set(component, value)
}

MultiMap.prototype.getAll = function (constructor) {
	return this.constructorMap.get(constructor)
}

export default {
	MultiMap,
}
