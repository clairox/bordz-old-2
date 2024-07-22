const currentYear = new Date().getFullYear()
const months = [
	'Month',
	'January',
	'February',
	'March',
	'April',
	'May',
	'June',
	'July',
	'August',
	'September',
	'October',
	'November',
	'December',
]
const days = ['Day', ...Array.from({ length: 31 }, (_, i) => String(i + 1))]
const years = [
	'Year',
	...Array.from({ length: currentYear - 1900 - 12 }, (_, i) => String(currentYear - i - 13)),
]

export { months, days, years }
