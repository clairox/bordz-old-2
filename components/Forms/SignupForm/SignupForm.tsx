'use client'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/UI/Form'
import { Button } from '@/components/UI/Button'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/UI/Select'
import SignupFormSchema from './schema'
import { months, days, years } from './schema/values'
import FormErrorBox from '@/components/UI/FormResponseBox/FormErrorBox'
import FormInputField from '@/components/UI/FormInputField'
import { RestClientError } from '@/lib/clients/restClient'
import { useSignupMutation } from '@/hooks'

type FormData = z.infer<typeof SignupFormSchema>

const SignupForm = () => {
    const { mutate: signup, status: signupStatus, error: signupError } = useSignupMutation()

    const form = useForm<FormData>({
        resolver: zodResolver(SignupFormSchema),
        defaultValues: {
            firstName: '',
            lastName: '',
            month: 'Month',
            day: 'Day',
            year: 'Year',
            email: '',
            password: '',
        },
    })
    const errors = form.formState.errors

    const [submitAttempted, setSubmitAttempted] = useState(false)
    const [monthSelectWidth, setMonthSelectWidth] = useState('var(--radix-select-trigger-width)')

    // Fixes the month SelectContent element not being wide enough on first render
    const monthSelectTriggerRef = useRef<HTMLButtonElement | null>(null)

    useEffect(() => {
        if (monthSelectTriggerRef.current) {
            const width = String(monthSelectTriggerRef.current.clientWidth + 2) + 'px'
            setMonthSelectWidth(width)
        }
    }, [])

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
        const { firstName, lastName, month, day, year, email, password } = data
        const birthDate = new Date(`${month} ${day}, ${year}`)

        const variables = {
            email,
            password,
            firstName,
            lastName,
            birthDate,
        }
        const options = {
            onSuccess: () => window.location.reload(),
        }

        signup(variables, options)
    }

    return (
        <Form {...form}>
            <form
                onSubmit={e => {
                    setSubmitAttempted(true)
                    form.handleSubmit(onSubmit)(e)
                }}
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

                    <FormLabel className="text-black">
                        Date of Birth
                        <div className="flex flex-row w-full">
                            <FormField
                                control={form.control}
                                name="month"
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                        <Select
                                            defaultValue={field.value}
                                            onValueChange={e => {
                                                field.onChange(e)
                                                if (submitAttempted) {
                                                    form.trigger()
                                                }
                                            }}
                                        >
                                            <FormControl>
                                                <SelectTrigger
                                                    ref={monthSelectTriggerRef}
                                                    data-testid="monthSelect"
                                                    className={`border-r-0 ${
                                                        // @ts-ignore
                                                        errors.birthDate &&
                                                        'border-red-500 text-red-500'
                                                    }`}
                                                >
                                                    <SelectValue />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent className={`w-[${monthSelectWidth}]`}>
                                                {months.map((month, idx) => (
                                                    <SelectItem key={idx} value={month}>
                                                        {month}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="day"
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                        <Select
                                            defaultValue={field.value}
                                            onValueChange={e => {
                                                field.onChange(e)
                                                if (submitAttempted) {
                                                    form.trigger()
                                                }
                                            }}
                                        >
                                            <FormControl>
                                                <SelectTrigger
                                                    data-testid="daySelect"
                                                    className={`border-r-0 ${
                                                        // @ts-ignore
                                                        errors.birthDate &&
                                                        'border-red-500 text-red-500'
                                                    }`}
                                                >
                                                    <SelectValue />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {days.map((day, idx) => (
                                                    <SelectItem key={idx} value={day}>
                                                        {day}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="year"
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                        <Select
                                            defaultValue={field.value}
                                            onValueChange={e => {
                                                field.onChange(e)
                                                if (submitAttempted) {
                                                    form.trigger()
                                                }
                                            }}
                                        >
                                            <FormControl>
                                                <SelectTrigger
                                                    data-testid="yearSelect"
                                                    className={`${
                                                        // @ts-ignore
                                                        errors.birthDate &&
                                                        'border-red-500 text-red-500'
                                                    }`}
                                                >
                                                    <SelectValue />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {years.map((year, idx) => (
                                                    <SelectItem key={idx} value={year}>
                                                        {year}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </FormItem>
                                )}
                            />
                        </div>
                        {Object.keys(errors).includes('birthDate') && (
                            // @ts-ignore
                            <p className="text-red-500 text-sm">{errors.birthDate!.message}</p>
                        )}
                    </FormLabel>
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
