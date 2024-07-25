import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import FormErrorBox from '@/components/FormResponseBox/FormErrorBox'
import PasswordInput from '@/components/PasswordInput'
import { Button } from '@/components/ui/Button'
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/Form'
import DeleteAccountFormSchema from './schema'

type FormData = z.infer<typeof DeleteAccountFormSchema>

const DeleteAccountForm = () => {
	const router = useRouter()
	const form = useForm<FormData>({
		resolver: zodResolver(DeleteAccountFormSchema),
		defaultValues: {
			confirmPassword: '',
		},
	})
	const errors = form.formState.errors

	const [formErrorMessage, setFormErrorMessage] = useState('')

	// TODO: !! Use Shopify Admin API to delete
	const onSubmit = async (data: FormData) => {
		const response = await fetch(`http://localhost:3000/api/customer`, {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json',
			},
			cache: 'no-cache',
		})

		if (response.ok) {
			router.replace('/')
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
				<p>
					You are about to delete your account. Please enter your password and click the
					&quot;Delete Account&quot; button to confirm your choice
				</p>
				<div className="w-full space-y-3">
					{formErrorMessage && <FormErrorBox>{formErrorMessage}</FormErrorBox>}
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
				<Button type="submit">Delete Account</Button>
			</form>
		</Form>
	)
}

export default DeleteAccountForm
