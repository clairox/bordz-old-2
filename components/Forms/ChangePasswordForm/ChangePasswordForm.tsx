'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import ChangePasswordFormSchema from './schema'
import { z } from 'zod'
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/Form'
import PasswordInput from '@/components/PasswordInput'
import { Button } from '@/components/ui/Button'
import FormSuccessBox from '@/components/FormResponseBox/FormSuccessBox'
import FormErrorBox from '@/components/FormResponseBox/FormErrorBox'

type FormData = z.infer<typeof ChangePasswordFormSchema>

const ChangePasswordForm = () => {
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
		const response = await fetch(`http://localhost:3000/api/customer`, {
			method: 'PATCH',
			body: JSON.stringify({ password: data.password }),
			headers: {
				'Content-Type': 'application/json',
			},
			cache: 'no-cache',
		})

		if (response.ok) {
			setFormSuccessMessage('Password changed successfully!')
		} else {
			const res = await response.json()
			setFormErrorMessage(res.error?.message)
		}
	}

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="w-full max-w-[350px] space-y-4"
				noValidate
			>
				<h1 className="mb-2 text-xl font-semibold">Change Password</h1>
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
										className={`${
											errors.password && 'border-red-500 text-red-500'
										} !anti-autocomplete-shadow`}
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
										className={`${
											errors.confirmPassword && 'border-red-500 text-red-500'
										} !anti-autocomplete-shadow`}
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

// TODO: !! Move !anti-autocomplete-shadow to base input component
