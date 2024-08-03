'use client'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/UI/Form'
import { Input } from '@/components/UI/Input'
import { Button } from '@/components/UI/Button'
import LoginFormSchema from './schema'
import Link from 'next/link'
import PasswordInput from '@/components/UI/PasswordInput'
import FormErrorBox from '@/components/UI/FormResponseBox/FormErrorBox'
import { useRouter, useSearchParams } from 'next/navigation'
import { login } from '@/lib/auth'

type FormData = z.infer<typeof LoginFormSchema>

type RedirectMessage = { [key: string]: string }

const redirectMessages: RedirectMessage = {
	session_expired: 'Your session has expired, please log in again.',
}

const LoginForm = () => {
	const router = useRouter()
	const searchParams = useSearchParams()
	const reason = searchParams.get('reason')
	const redirect = searchParams.get('redirect')

	const form = useForm<FormData>({
		resolver: zodResolver(LoginFormSchema),
		defaultValues: {
			email: '',
			password: '',
		},
	})
	const errors = form.formState.errors

	let initialFormErrorMessage = ''
	if (reason && Object.keys(redirectMessages).includes(reason)) {
		initialFormErrorMessage = redirectMessages[reason]
	}
	const [formErrorMessage, setFormErrorResponse] = useState(initialFormErrorMessage)

	const onSubmit = async (data: FormData) => {
		setFormErrorResponse('')

		const { email, password } = data
		const { success, error } = await login(email, password)

		if (success === false) {
			return setFormErrorResponse(error?.message || 'Something went wrong, please try again.')
		}

		if (redirect) {
			return router.push(redirect)
		} else {
			return window.location.reload()
		}
	}

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="w-full max-w-[300px] space-y-4"
				noValidate
			>
				<h1 className="mb-2 text-xl font-semibold">Login</h1>
				<div className="space-y-3">
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
										type="email"
									/>
								</FormControl>
								{errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
							</FormItem>
						)}
					/>
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
					>
						Create an account
					</Link>
				</p>
			</form>
		</Form>
	)
}

export default LoginForm
