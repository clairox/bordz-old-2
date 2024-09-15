import { CURRENT_YEAR, MIN_YEAR } from '@/lib/utils/constants'

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
    ...Array.from({ length: CURRENT_YEAR - MIN_YEAR + 1 }, (_, i) => String(CURRENT_YEAR - i)),
]

export { months, days, years }
