function naturalFloor (n) {
	if (n > 0) {
		return Math.floor(n)
	}
	if (n < 0) {
		return Math.ceil(n)
	}
	return n
}

export const math = {
	naturalFloor,
}
