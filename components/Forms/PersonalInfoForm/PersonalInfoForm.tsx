'use client'
import React, { useMemo } from 'react'
import { z } from 'zod'
import PersonalInfoFormSchema from './schema'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form } from '@/components/UI/Form'
import FormSuccessBox from '@/components/UI/FormResponseBox/FormSuccessBox'
import FormErrorBox from '@/components/UI/FormResponseBox/FormErrorBox'
import { Button } from '@/components/UI/Button'
import { useAccount } from '@/context/AccountContext/AccountContext'
import { useRouter, usePathname } from 'next/navigation'
import FormInputField from '@/components/UI/FormInputField/FormInputField'
import { useUpdatePersonalDetails } from '@/hooks'

type FormData = z.infer<typeof PersonalInfoFormSchema>

const PersonalInfoForm = () => {
    const router = useRouter()
    const pathname = usePathname()

    const { data: customer } = useAccount()
    const {
        mutate: updatePersonalDetails,
        status: updateStatus,
        error: updateError,
    } = useUpdatePersonalDetails()

    const form = useForm<FormData>({
        resolver: zodResolver(PersonalInfoFormSchema),
        defaultValues: {
            email: customer?.email,
            firstName: customer?.firstName,
            lastName: customer?.lastName,
        },
    })

    const formErrorMessage = useMemo(() => {
        if (updateStatus === 'error') {
            const { message } = updateError as Error
            if (message === 'Session expired') {
                const url = new URL('/login', window.location.origin)
                url.searchParams.set('redirect', encodeURIComponent(pathname))
                url.searchParams.set('reason', 'session_expired')

                router.push(url.toString())
                return
            }

            return message
        }

        if (updateStatus === 'pending') {
            return ''
        }

        return ''
    }, [updateStatus, updateError, pathname, router])

    const formSuccessMessage = useMemo(() => {
        if (updateStatus === 'success') {
            const activeElement = document.activeElement as HTMLElement
            activeElement.blur()

            return 'Personal info updated successfully!'
        }

        if (updateStatus === 'pending') {
            return ''
        }

        return ''
    }, [updateStatus])

    const onSubmit = async (data: FormData) => {
        updatePersonalDetails(data)
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
                    <FormInputField control={form.control} name={'email'} label={'Email'} />
                    <FormInputField
                        control={form.control}
                        name={'firstName'}
                        label={'First Name'}
                    />
                    <FormInputField control={form.control} name={'lastName'} label={'Last Name'} />
                </div>
                <Button type="submit">Submit</Button>
            </form>
        </Form>
    )
}

export default PersonalInfoForm
