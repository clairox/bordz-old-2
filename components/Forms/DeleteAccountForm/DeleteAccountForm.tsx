'use client'
import React, { useMemo } from 'react'
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
import FormInputField from '@/components/UI/FormInputField'
import { useLogoutMutation } from '@/hooks'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { LoginData } from '@/types'
import { RestClientError, restClient } from '@/lib/clients/restClient'

type FormData = z.infer<typeof DeleteAccountFormSchema>

const DeleteAccountForm = () => {
    const { data: customer } = useAccount()
    const { mutate: logout } = useLogoutMutation()

    const router = useRouter()
    const pathname = usePathname()

    const form = useForm<FormData>({
        resolver: zodResolver(DeleteAccountFormSchema),
        defaultValues: {
            confirmPassword: '',
        },
    })

    const { mutate: confirmCredentials, status: confirmStatus } = useMutation({
        mutationFn: async (credentials: LoginData) => {
            try {
                await restClient('/auth/confirm', {
                    method: 'POST',
                    body: JSON.stringify(credentials),
                    cache: 'no-cache',
                })

                return true
            } catch (error) {
                throw error
            }
        },
    })

    const queryClient = useQueryClient()
    const { mutate: deleteCustomer, error: deleteCustomerError } = useMutation({
        mutationFn: async () => {
            const customerId = customer?.id
            if (customerId == undefined) {
                return false
            }

            const config = {
                method: 'DELETE',
                body: JSON.stringify({ id: customerId }),
            }

            try {
                await restClient('/customer', config)
                return true
            } catch (error) {
                if (error instanceof RestClientError) {
                    if (error.response.status === 401) {
                        console.error('You are not allowed to do that!')
                        throw new Error('Session expired')
                    } else {
                        throw new Error(error.response.data.message)
                    }
                } else {
                    throw error
                }
            }
        },

        onSuccess: () =>
            queryClient.invalidateQueries({ queryKey: ['getCustomer'], refetchType: 'none' }),
    })

    const formErrorMessage = useMemo(() => {
        if (confirmStatus === 'pending') {
            return ''
        }

        if (confirmStatus === 'error') {
            return 'Password is incorrect.'
        }

        if (deleteCustomerError) {
            const { message } = deleteCustomerError as Error
            if (message === 'Session expired') {
                const url = makeLoginRedirectURL(pathname, 'session_expired')
                router.push(url.toString())
                return
            }

            return message
        }

        return ''
    }, [confirmStatus, deleteCustomerError, pathname, router])

    const onSubmit = async (data: FormData) => {
        if (customer == undefined) {
            return
        }

        confirmCredentials(
            { email: customer.email, password: data.confirmPassword },
            { onSuccess: () => handleConfirmCredentialsSuccess() },
        )

        const handleConfirmCredentialsSuccess = () => {
            const options = { onSuccess: () => handleDeleteCustomerSuccess() }
            deleteCustomer(undefined as void, options)
        }

        const handleDeleteCustomerSuccess = () => {
            const options = { onSuccess: () => (window.location.href = '/') }
            logout(undefined as void, options)
        }
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
