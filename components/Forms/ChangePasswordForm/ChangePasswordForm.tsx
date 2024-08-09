'use client'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/UI/Form'
import PasswordInput from '@/components/UI/PasswordInput'
import { Button } from '@/components/UI/Button'
import FormSuccessBox from '@/components/UI/FormResponseBox/FormSuccessBox'
import FormErrorBox from '@/components/UI/FormResponseBox/FormErrorBox'
import ChangePasswordFormSchema from './schema'
import { useRouter } from 'next/navigation'
import { usePathname } from 'next/navigation'
import { useAccountContext } from '@/context/AccountContext/AccountContext'
import { makeLoginRedirectURL } from '@/lib/auth/auth'

type FormData = z.infer<typeof ChangePasswordFormSchema>

const ChangePasswordForm = () => {
	const router = useRouter()
	const pathname = usePathname()

	const { updatePassword } = useAccountContext()

	const form = useForm<FormData>({
		resolver: zodResolver(ChangePasswordFormSchema),
		defaultValues: {
			password: '',
			confirmPassword: '',
		},
	})
	const errors = form.formState.errors

	const [formSuccessMessage, setFormSuccessMessage] = useState('')
	const [formErrorMessage, setFormErrorMessage] = useState('')

	const onSubmit = async (data: FormData) => {
		setFormSuccessMessage('')
		setFormErrorMessage('')

		try {
			await updatePassword(data.password)

			setFormSuccessMessage('Password updated successfully!')

			const activeElement = document.activeElement as HTMLElement
			activeElement.blur()
			form.reset()
		} catch (error) {
			const { message } = error as Error
			if (message === 'Session expired') {
				const url = makeLoginRedirectURL(pathname, 'session_expired')
				router.push(url.toString())
				return
			}

			setFormErrorMessage(message)
		}
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
					<FormField
						control={form.control}
						name="password"
						render={({ field }) => (
							<FormItem>
								<FormLabel className="text-black">Password</FormLabel>
								<FormControl>
									<PasswordInput
										className={`${errors.password && 'border-red-500 text-red-500'}`}
										{...field}
									/>
								</FormControl>
								{errors.password && (
									<p className="text-red-500 text-sm">{errors.password.message}</p>
								)}
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="confirmPassword"
						render={({ field }) => (
							<FormItem>
								<FormLabel className="text-black">Confirm Password</FormLabel>
								<FormControl>
									<PasswordInput
										className={`${errors.confirmPassword && 'border-red-500 text-red-500'}`}
										{...field}
									/>
								</FormControl>
								{errors.confirmPassword && (
									<p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>
								)}
							</FormItem>
						)}
					/>
				</div>
				<Button type="submit">Submit</Button>
			</form>
		</Form>
	)
}

export default ChangePasswordForm
