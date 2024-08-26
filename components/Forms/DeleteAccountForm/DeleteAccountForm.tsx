'use client'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import FormErrorBox from '@/components/UI/FormResponseBox/FormErrorBox'
import { Button } from '@/components/UI/Button'
import { Form } from '@/components/UI/Form'
import DeleteAccountFormSchema from './schema'
import { usePathname, useRouter } from 'next/navigation'
import { useAccount } from '@/context/AccountContext/AccountContext'
import { makeLoginRedirectURL } from '@/lib/utils/helpers'
import { useAuth } from '@/context/AuthContext/AuthContext'
import FormInputField from '@/components/UI/FormInputField'

type FormData = z.infer<typeof DeleteAccountFormSchema>

const DeleteAccountForm = () => {
    const { data: customer, deleteCustomer } = useAccount()
    // TODO: change this after useAuth refactor
    const { checkCredentials, logout } = useAuth()

    const router = useRouter()
    const pathname = usePathname()

    const form = useForm<FormData>({
        resolver: zodResolver(DeleteAccountFormSchema),
        defaultValues: {
            confirmPassword: '',
        },
    })

    // TODO: memoize formErrorMessage after useAuth is refactored with react-query
    const [formErrorMessage, setFormErrorMessage] = useState('')

    useEffect(() => {
        const { isPending, error } = deleteCustomer!
        if (error) {
            const { message } = error as Error
            if (message === 'Session expired') {
                const url = makeLoginRedirectURL(pathname, 'session_expired')
                router.push(url.toString())
                return
            }

            setFormErrorMessage(message)
        }

        if (isPending) {
            setFormErrorMessage('')
        }

        setFormErrorMessage('')
    }, [deleteCustomer, pathname, router])

    useEffect(() => {
        if (deleteCustomer?.isSuccess) {
            logout().then(() => (window.location.href = '/'))
        }
    }, [deleteCustomer, logout])

    const isPasswordCorrect = async (password: string): Promise<boolean> => {
        return await checkCredentials(customer.email, password)
    }

    const onSubmit = async (data: FormData) => {
        setFormErrorMessage('')

        const isCorrectPassword = await isPasswordCorrect(data.confirmPassword)
        if (!isCorrectPassword) {
            return setFormErrorMessage('Password is incorrect.')
        }

        deleteCustomer!.mutate()
    }

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="w-full max-w-[350px] space-y-4"
                noValidate
            >
                <p>
                    You are about to delete your account. Please enter your password and click the
                    &quot;Delete Account&quot; button to confirm your choice
                </p>
                <div className="w-full space-y-3">
                    {formErrorMessage && <FormErrorBox>{formErrorMessage}</FormErrorBox>}
                    <FormInputField
                        control={form.control}
                        type={'password'}
                        name={'confirmPassword'}
                        label={'Confirm Password'}
                    />
                </div>
                <Button variant={'destructive'} type="submit">
                    Delete Account
                </Button>
            </form>
        </Form>
    )
}

export default DeleteAccountForm
