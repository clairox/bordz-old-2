import { z } from 'zod'

const emailSchema = z
	.string()
	.min(1, 'Please enter an email address')
	.email('Invalid email address')
const passwordSchema = z.string().min(1, { message: 'Please enter a password' })

const LoginFormSchema = z.object({
	email: emailSchema,
	password: passwordSchema,
})

export default LoginFormSchema
