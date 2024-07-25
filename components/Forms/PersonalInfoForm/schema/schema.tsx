import { z } from 'zod'

const emailSchema = z
	.string()
	.min(1, 'Please enter an email address')
	.email('Invalid email address')
const firstNameSchema = z
	.string()
	.min(1, 'Please enter your first name')
	.max(50, 'First name must not exceed 50 characters')
	.regex(/^[a-zA-Z]+$/, 'First name can only contain letters')
const lastNameSchema = z
	.string()
	.min(1, 'Please enter your last name')
	.max(50, 'Last name must not exceed 50 characters')
	.regex(/^[a-zA-Z]+$/, 'Last name can only contain letters')
const PersonalInfoFormSchema = z.object({
	email: emailSchema,
	firstName: firstNameSchema,
	lastName: lastNameSchema,
})

export default PersonalInfoFormSchema
