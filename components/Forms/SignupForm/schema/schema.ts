import { z } from 'zod'
import { MIN_ALLOWED_CUSTOMER_AGE } from '@/lib/utils/constants'

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
const emailSchema = z
    .string()
    .min(1, 'Please enter an email address')
    .email('Invalid email address')
const passwordSchema = z
    .string()
    .min(1, 'Please enter a password')
    .min(8, 'Password must be at least 8 characters long')
const birthDateSchema = z
    .date()
    .nullish()
    .refine(
        data => {
            return data != undefined
        },
        { message: 'Invalid date' },
    )
    .refine(
        data => {
            const date = data!
            const age = new Date().getFullYear() - date.getFullYear()
            const today = new Date()
            const birthDateThisYear = new Date(today.getFullYear(), date.getMonth(), date.getDate())
            return (
                age > MIN_ALLOWED_CUSTOMER_AGE ||
                (age === MIN_ALLOWED_CUSTOMER_AGE && birthDateThisYear <= today)
            )
        },
        { message: `You must be at least ${MIN_ALLOWED_CUSTOMER_AGE} years old` },
    )

const SignupFormSchema = z.object({
    firstName: firstNameSchema,
    lastName: lastNameSchema,
    birthDate: birthDateSchema,
    email: emailSchema,
    password: passwordSchema,
})

export default SignupFormSchema
