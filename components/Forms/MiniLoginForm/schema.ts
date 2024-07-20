import { z } from 'zod'

const MiniLoginFormSchema = z.object({
	email: z.string().min(1, { message: 'Email must not be empty' }),
	password: z.string().min(1, { message: 'Please enter a password' }),
})

export default MiniLoginFormSchema
