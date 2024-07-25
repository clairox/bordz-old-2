import { z } from 'zod'

const confirmPasswordSchema = z.string().min(1, 'Please enter your password')
const DeleteAccountFormSchema = z.object({
	confirmPassword: confirmPasswordSchema,
})

export default DeleteAccountFormSchema
