'use client'
import React, { useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form } from '@/components/UI/Form'
import { Button } from '@/components/UI/Button'
import FormSuccessBox from '@/components/UI/FormResponseBox/FormSuccessBox'
import FormErrorBox from '@/components/UI/FormResponseBox/FormErrorBox'
import ChangePasswordFormSchema from './schema'
import { useRouter } from 'next/navigation'
import { usePathname } from 'next/navigation'
import { makeLoginRedirectURL } from '@/lib/utils/helpers'
import FormInputField from '@/components/UI/FormInputField'
import { useAccountMutations } from '@/hooks/useAccountMutations'

type FormData = z.infer<typeof ChangePasswordFormSchema>

const ChangePasswordForm = () => {
    const router = useRouter()
    const pathname = usePathname()

    const { updatePassword } = useAccountMutations()

    const form = useForm<FormData>({
        resolver: zodResolver(ChangePasswordFormSchema),
        defaultValues: {
            password: '',
            confirmPassword: '',
        },
    })

    const formErrorMessage = useMemo(() => {
        if (updatePassword.isError) {
            const { message } = updatePassword.error as Error
            if (message === 'Session expired') {
                const url = makeLoginRedirectURL(pathname, 'session_expired')
                router.push(url.toString())
                return
            }

            return message
        }

        if (updatePassword.isPending) {
            return ''
        }

        return ''
    }, [updatePassword, pathname, router])

    const formSuccessMessage = useMemo(() => {
        if (updatePassword.isSuccess) {
            return 'Personal info updated successfully!'
        }

        if (updatePassword.isPending) {
            return ''
        }

        return ''
    }, [updatePassword])

    const onSubmit = async (data: FormData) => {
        updatePassword.mutate(data.password, {
            onSuccess: () => {
                const activeElement = document.activeElement as HTMLElement
                activeElement.blur()
                form.reset()
            },
        })
    }

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="w-full max-w-[350px] space-y-4"
                noValidate
            >
                <div className="w-full space-y-3">
                    {formSuccessMessage && <FormSuccessBox>{formSuccessMessage}</FormSuccessBox>}
                    {formErrorMessage && <FormErrorBox>{formErrorMessage}</FormErrorBox>}

                    <FormInputField
                        control={form.control}
                        type={'password'}
                        name={'password'}
                        label={'Password'}
                    />
                    <FormInputField
                        control={form.control}
                        type={'password'}
                        name={'confirmPassword'}
                        label={'Confirm Password'}
                    />
                </div>
                <Button type="submit">Submit</Button>
            </form>
        </Form>
    )
}

export default ChangePasswordForm
