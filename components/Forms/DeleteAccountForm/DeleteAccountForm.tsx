'use client'
import React, { useEffect, useMemo } from 'react'
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
import { useAuthMutations } from '@/hooks/useAuthMutations/useAuthMutations'
import { useAccountMutations } from '@/hooks/useAccountMutations'
import Redirect from '@/components/Redirect'

type FormData = z.infer<typeof DeleteAccountFormSchema>

const DeleteAccountForm = () => {
    const { data: customer } = useAccount()
    const { deleteCustomer } = useAccountMutations()
    const { logout, confirmCredentials } = useAuthMutations()

    const router = useRouter()
    const pathname = usePathname()

    const form = useForm<FormData>({
        resolver: zodResolver(DeleteAccountFormSchema),
        defaultValues: {
            confirmPassword: '',
        },
    })

    const formErrorMessage = useMemo(() => {
        if (confirmCredentials.isPending) {
            return ''
        }

        if (confirmCredentials.isError) {
            return 'Password is incorrect.'
        }

        if (deleteCustomer.isError) {
            const { message } = deleteCustomer.error as Error
            if (message === 'Session expired') {
                const url = makeLoginRedirectURL(pathname, 'session_expired')
                router.push(url.toString())
                return
            }

            return message
        }

        return ''
    }, [confirmCredentials, deleteCustomer, pathname, router])

    const onSubmit = async (data: FormData) => {
        if (customer == undefined) {
            return
        }

        confirmCredentials.mutate(
            { email: customer.email, password: data.confirmPassword },
            {
                onSuccess: () => handleConfirmCredentialsSuccess(),
            },
        )

        const handleConfirmCredentialsSuccess = () => {
            deleteCustomer.mutate(undefined as void, {
                onSuccess: () => handleDeleteCustomerSuccess(),
            })
        }

        const handleDeleteCustomerSuccess = () => {
            logout.mutate(undefined as void, {
                onSuccess: () => (window.location.href = '/'),
            })
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
