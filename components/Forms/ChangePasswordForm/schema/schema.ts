import { z } from 'zod'

const passwordSchema = z
	.string()
	.min(1, 'Please enter a password')
	.min(8, 'Password must be at least 8 characters long')
const confirmPasswordSchema = z.string().min(1, 'Please enter password confirmation')

const ChangePasswordFormSchema = z
	.object({
		password: passwordSchema,
		confirmPassword: confirmPasswordSchema,
	})
	.refine(
		data => {
			const { password, confirmPassword } = data
			return confirmPassword === password
		},
		{ message: 'Passwords do not match', path: ['confirmPassword'] }
	)

export default ChangePasswordFormSchema
