import { z } from 'zod'
import { days, months, years } from './values'

const MonthEnum = z.enum([months[0], ...months.slice(1)])
const DayEnum = z.enum([days[0], ...days.slice(1)])
const YearEnum = z.enum([years[0], ...years.slice(1)])

export { MonthEnum, DayEnum, YearEnum }
