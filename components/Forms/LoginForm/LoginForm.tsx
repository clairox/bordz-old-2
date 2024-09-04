'use client'
import React, { useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form } from '@/components/UI/Form'
import { Button } from '@/components/UI/Button'
import LoginFormSchema from './schema'
import Link from 'next/link'
import FormErrorBox from '@/components/UI/FormResponseBox/FormErrorBox'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuthMutations } from '@/hooks/useAuthMutations/useAuthMutations'
import { RestClientError } from '@/lib/clients/restClient'
import FormInputField from '@/components/UI/FormInputField'

type FormData = z.infer<typeof LoginFormSchema>

type RedirectMessage = { [key: string]: string }

const redirectMessages: RedirectMessage = {
    session_expired: 'Your session has expired, please log in again.',
}

const LoginForm = () => {
    const { login } = useAuthMutations()

    const router = useRouter()
    const searchParams = useSearchParams()
    const reason = searchParams.get('reason')
    const redirect = searchParams.get('redirect')

    const form = useForm<FormData>({
        resolver: zodResolver(LoginFormSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    })

    let initialFormErrorMessage = ''
    if (reason && Object.keys(redirectMessages).includes(reason)) {
        initialFormErrorMessage = redirectMessages[reason]
    }

    const formErrorMessage = useMemo(() => {
        if (login.isPending) {
            return ''
        }

        if (login.isError) {
            const error = login.error as RestClientError
            if (!form.formState.isSubmitted || error == undefined) {
                return
            }
            switch (error?.status) {
                case 401:
                    return 'Login failed. Please verify your email and password.'
                default:
                    return 'Something went wrong, please try again.'
            }
        }
    }, [login, form.formState.isSubmitted])

    const onSubmit = async (data: FormData) => {
        const { email, password } = data
        login.mutate(
            { email, password },
            { onSuccess: () => (redirect ? router.push(redirect) : window.location.reload()) },
        )
    }

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="w-full max-w-[300px] space-y-4"
                noValidate
            >
                <h1 className="mb-2 text-xl font-semibold">Login</h1>
                <div className="space-y-3">
                    {formErrorMessage && <FormErrorBox>{formErrorMessage}</FormErrorBox>}
                    <FormInputField control={form.control} name={'email'} label={'Email'} />
                    <FormInputField
                        control={form.control}
                        type={'password'}
                        name={'password'}
                        label={'Password'}
                    />
                </div>
                <div>
                    <Link href="#" className="text-sm hover:underline">
                        Forgot password?
                    </Link>
                </div>
                <Button type="submit">Submit</Button>
                <p className="text-sm">
                    New customer?{' '}
                    <Link
                        href={{ pathname: '/login', query: { register: true } }}
                        className="hover:underline"
                    >
                        Create an account
                    </Link>
                </p>
            </form>
        </Form>
    )
}

export default LoginForm
