'use client'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/Form'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { useAuth } from '@/context/AuthContext/AuthContext'
import LoginFormSchema from './schema'
import Link from 'next/link'
import PasswordInput from '@/components/PasswordInput'
import { WarningCircle } from '@phosphor-icons/react'

type FormData = z.infer<typeof LoginFormSchema>

const LoginForm = () => {
	const { login } = useAuth()

	const form = useForm<FormData>({
		resolver: zodResolver(LoginFormSchema),
		defaultValues: {
			email: '',
			password: '',
		},
	})
	const errors = form.formState.errors

	const [formErrorResponse, setFormErrorResponse] = useState('')

	const onSubmit = async (data: FormData) => {
		setFormErrorResponse('')

		const { email, password } = data
		const response = await login(email, password)

		if (response.error) {
			const { field, message } = response.error
			switch (field) {
				default:
					return setFormErrorResponse(message)
			}
		}

		return window.location.reload()
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
					{formErrorResponse && (
						<div className="flex flex-row gap-4 justify-center items-center px-4 w-full h-[75px] bg-red-200 text-sm">
							<WarningCircle size={50} weight="regular" />
							<p>{formErrorResponse}</p>
						</div>
					)}
					<FormField
						control={form.control}
						name="email"
						render={({ field }) => (
							<FormItem>
								<FormLabel className="text-black">Email</FormLabel>
								<FormControl>
									<Input
										className={errors.email && 'border-red-500 text-red-500'}
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
										className={errors.password && 'border-red-500 text-red-500'}
										{...field}
										type="password"
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
