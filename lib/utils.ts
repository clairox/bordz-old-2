export const isNumeric = (value: string): boolean => {
	for (let i = 0; i < value.length; i++) {
		const code = value.charCodeAt(i)
		if (code < 48 || code > 57) {
			return false
		}
	}
	return value.length > 0
}

export const toIntegerOrNaN = (value: any): number => {
	if (typeof value === 'string' && value.includes('.')) {
		return NaN
	}

	const num = Number(value)
	return Number.isInteger(num) ? num : NaN
}

export const toStrictIntegerOrNaN = (value: any): number => {
	if (value === null) {
		return NaN
	}

	return toIntegerOrNaN(value)
}

export const roundUp = (value: number, to: number = 10) => Math.ceil(value / to) * to
