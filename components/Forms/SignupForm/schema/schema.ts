import { z } from 'zod'
import { DayEnum, MonthEnum, YearEnum } from './enums'

const firstNameSchema = z
	.string()
	.regex(/^[a-zA-Z]+$/, 'First name can only contain letters')
	.max(50, 'First name must not exceed 50 characters')
	.min(1, 'First name is required')
const lastNameSchema = z
	.string()
	.regex(/^[a-zA-Z]+$/, 'Last name can only contain letters')
	.max(50, 'Last name must not exceed 50 characters')
	.min(1, 'Last name is required')
const emailSchema = z
	.string()
	.email('Invalid email address')
	.min(1, 'Please enter an email address')
const passwordSchema = z
	.string()
	.min(8, 'Password must be at least 8 characters long')
	.min(1, 'Password is required')

const SignupFormSchema = z
	.object({
		firstName: firstNameSchema,
		lastName: lastNameSchema,
		month: MonthEnum,
		day: DayEnum,
		year: YearEnum,
		email: emailSchema,
		password: passwordSchema,
	})
	.refine(
		data => {
			const { month, day, year } = data
			if (month === 'Month' || day === 'Day' || year === 'Year') {
				return false
			}

			const date = new Date(`${month} ${day}, ${year}`)
			return !isNaN(date.getTime()) && date.getDate() === parseInt(day, 10)
		},
		{ message: 'Invalid date', path: ['birthDate'] }
	)
	.refine(
		data => {
			const { month, day, year } = data
			const date = new Date(`${month} ${day}, ${year}`)
			const age = new Date().getFullYear() - date.getFullYear()
			const today = new Date()
			const birthDateThisYear = new Date(today.getFullYear(), date.getMonth(), date.getDate())
			return age > 13 || (age === 13 && birthDateThisYear <= today)
		},
		{ message: 'You must be at least 13 years old', path: ['birthDate'] }
	)

export default SignupFormSchema
