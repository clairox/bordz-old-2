'use client'
import React, { useMemo } from 'react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form } from '@/components/UI/Form'
import { Button } from '@/components/UI/Button'
import SignupFormSchema from './schema'
import FormErrorBox from '@/components/UI/FormResponseBox/FormErrorBox'
import FormInputField from '@/components/UI/FormInputField'
import { RestClientError } from '@/lib/clients/restClient'
import { useSignupMutation } from '@/hooks'
import FormDateSelectField from '@/components/UI/FormDateSelectField'
import { MIN_ALLOWED_CUSTOMER_AGE } from '@/lib/utils/constants'

type FormData = z.infer<typeof SignupFormSchema>

const SignupForm = () => {
    const { mutate: signup, status: signupStatus, error: signupError } = useSignupMutation()

    const form = useForm<FormData>({
        resolver: zodResolver(SignupFormSchema),
        defaultValues: {
            firstName: '',
            lastName: '',
            birthDate: undefined,
            email: '',
            password: '',
        },
    })

    const formErrorMessage = useMemo(() => {
        if (signupStatus === 'pending') {
            return ''
        }

        if (signupStatus === 'error') {
            const error = signupError as RestClientError
            if (!form.formState.isSubmitted || error == undefined) {
                return
            }

            switch (error.response.status) {
                case 409:
                    return 'Registration failed. An account with this email already exists.'
                default:
                    return 'Something went wrong, please try again.'
            }
        }
    }, [signupError, signupStatus, form.formState.isSubmitted])

    const onSubmit = async (data: FormData) => {
        const options = {
            onSuccess: () => window.location.reload(),
        }

        signup({ ...data, birthDate: data.birthDate! }, options)
    }

    return (
        <Form {...form}>
            <form
                onSubmit={e => form.handleSubmit(onSubmit)(e)}
                className="w-full max-w-[350px] space-y-4"
                noValidate
            >
                <h1 className="mb-2 text-xl font-semibold">Sign Up</h1>
                <div className="w-full space-y-3">
                    {formErrorMessage && <FormErrorBox>{formErrorMessage}</FormErrorBox>}
                    <FormInputField
                        control={form.control}
                        name={'firstName'}
                        label={'First Name'}
                    />
                    <FormInputField control={form.control} name={'lastName'} label={'Last Name'} />
                    <FormDateSelectField
                        control={form.control}
                        name={'birthDate'}
                        label={'Date of Birth'}
                        maxYear={new Date().getFullYear() - MIN_ALLOWED_CUSTOMER_AGE}
                    />
                    <FormInputField control={form.control} name={'email'} label={'Email'} />
                    <FormInputField
                        control={form.control}
                        type={'password'}
                        name={'password'}
                        label={'Password'}
                    />
                </div>
                <Button type="submit">Submit</Button>
                <p className="text-sm">
                    Already have an account?{' '}
                    <Link href={{ pathname: '/login' }} className="hover:underline">
                        Log in
                    </Link>
                </p>
            </form>
        </Form>
    )
}

export default SignupForm
