'use client'
import React, { useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form } from '@/components/UI/Form'
import { Button } from '@/components/UI/Button'
import MiniLoginFormSchema from './schema'
import Link from 'next/link'
import FormErrorBox from '@/components/UI/FormResponseBox/FormErrorBox'
import { useAuthMutations } from '@/hooks/useAuthMutations/useAuthMutations'
import { RestClientError } from '@/lib/clients/restClient'
import FormInputField from '@/components/UI/FormInputField'

type FormData = z.infer<typeof MiniLoginFormSchema>

const MiniLoginForm: React.FunctionComponent<{
    closePopover: () => void
}> = ({ closePopover }) => {
    const { login } = useAuthMutations()

    const form = useForm<FormData>({
        resolver: zodResolver(MiniLoginFormSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    })

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
        login.mutate({ email, password }, { onSuccess: () => window.location.reload() })
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 space-y-4" noValidate>
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
                        onClick={closePopover}
                    >
                        Create an account
                    </Link>
                </p>
            </form>
        </Form>
    )
}

export default MiniLoginForm
