'use client'
import React, { useState } from 'react'
import { z } from 'zod'
import PersonalInfoFormSchema from './schema'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/UI/Form'
import FormSuccessBox from '@/components/UI/FormResponseBox/FormSuccessBox'
import FormErrorBox from '@/components/UI/FormResponseBox/FormErrorBox'
import { Input } from '@/components/UI/Input'
import { Button } from '@/components/UI/Button'
import { useAccountContext } from '@/context/AccountContext/AccountContext'

type FormData = z.infer<typeof PersonalInfoFormSchema>

const PersonalInfoForm = () => {
	const { customer } = useAccountContext()
	const { email, firstName, lastName } = customer

	const form = useForm<FormData>({
		resolver: zodResolver(PersonalInfoFormSchema),
		defaultValues: {
			email,
			firstName,
			lastName,
		},
	})
	const errors = form.formState.errors

	const [formSuccessMessage, setFormSuccessMessage] = useState('')
	const [formErrorMessage, setFormErrorMessage] = useState('')

	const onSubmit = async (data: FormData) => {
		const { email, firstName, lastName } = data
		const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/customer`, {
			method: 'PATCH',
			body: JSON.stringify({ email, firstName, lastName }),
			headers: {
				'Content-Type': 'application/json',
			},
			cache: 'no-cache',
		})

		if (response.ok) {
			setFormSuccessMessage('Personal info updated successfully!')

			const activeElement = document.activeElement as HTMLElement
			activeElement.blur()
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
				<div className="w-full space-y-3">
					{formSuccessMessage && <FormSuccessBox>{formSuccessMessage}</FormSuccessBox>}
					{formErrorMessage && <FormErrorBox>{formErrorMessage}</FormErrorBox>}
					<FormField
						control={form.control}
						name="email"
						render={({ field }) => (
							<FormItem>
								<FormLabel className="text-black">Email</FormLabel>
								<FormControl>
									<Input
										className={`${errors.email && 'border-red-500 text-red-500'}`}
										{...field}
									/>
								</FormControl>
								{errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="firstName"
						render={({ field }) => (
							<FormItem>
								<FormLabel className="text-black">First Name</FormLabel>
								<FormControl>
									<Input
										className={`${errors.firstName && 'border-red-500 text-red-500'}`}
										{...field}
									/>
								</FormControl>
								{errors.firstName && (
									<p className="text-red-500 text-sm">{errors.firstName.message}</p>
								)}
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="lastName"
						render={({ field }) => (
							<FormItem>
								<FormLabel className="text-black">Last Name</FormLabel>
								<FormControl>
									<Input
										className={`${errors.lastName && 'border-red-500 text-red-500'}`}
										{...field}
									/>
								</FormControl>
								{errors.lastName && (
									<p className="text-red-500 text-sm">{errors.lastName.message}</p>
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

export default PersonalInfoForm
