'use client'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAuth } from '@/context/AuthContext/AuthContext'
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/Form'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/Select'
import PasswordInput from '@/components/PasswordInput'
import SignupFormSchema from './schema'
import { months, days, years } from './schema/values'
import FormErrorBox from '@/components/FormErrorBox'

type FormData = z.infer<typeof SignupFormSchema>

const SignupForm = () => {
	const { signup } = useAuth()

	const form = useForm<FormData>({
		resolver: zodResolver(SignupFormSchema),
		defaultValues: {
			firstName: '',
			lastName: '',
			month: 'Month',
			day: 'Day',
			year: 'Year',
			email: '',
			password: '',
		},
	})
	const errors = form.formState.errors

	const [submitAttempted, setSubmitAttempted] = useState(false)
	const [monthSelectWidth, setMonthSelectWidth] = useState('var(--radix-select-trigger-width)')
	const [formErrorResponse, setFormErrorResponse] = useState('')
	const [emailErrorResponse, setEmailErrorResponse] = useState('')

	const monthSelectTrigger = useRef<HTMLButtonElement | null>(null)

	// Fixes the month SelectContent element not being wide enough on first render
	const updateMonthSelectWidth = useCallback(() => {
		if (monthSelectTrigger.current) {
			const width = String(monthSelectTrigger.current.clientWidth + 2) + 'px'
			setMonthSelectWidth(width)
		}
	}, [monthSelectTrigger])

	useEffect(() => {
		updateMonthSelectWidth()
	}, [updateMonthSelectWidth])

	// TODO: ?? Store extra account details (birth date, etc.) in postgres db
	const onSubmit = async (data: FormData) => {
		const { firstName, lastName, email, password } = data
		const response = await signup(firstName, lastName, email, password)

		if (response.error) {
			const { field, message } = response.error
			switch (field) {
				case 'email':
					return setEmailErrorResponse(message)
				default:
					return setFormErrorResponse(message)
			}
		}

		return (window.location.href = '/')
	}

	return (
		<Form {...form}>
			<form
				onSubmit={e => {
					setSubmitAttempted(true)
					form.handleSubmit(onSubmit)(e)
				}}
				className="w-full max-w-[350px] space-y-4"
				noValidate
			>
				<h1 className="mb-2 text-xl font-semibold">Sign Up</h1>
				<div className="w-full space-y-3">
					{formErrorResponse && <FormErrorBox>{formErrorResponse}</FormErrorBox>}
					<FormField
						control={form.control}
						name="firstName"
						render={({ field }) => (
							<FormItem>
								<FormLabel className="text-black">First Name</FormLabel>
								<FormControl>
									<Input
										className={`${
											errors.firstName && 'border-red-500 text-red-500'
										} !anti-autocomplete-shadow`}
										{...field}
										type="firstName"
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
										className={`${
											errors.lastName && 'border-red-500 text-red-500'
										} !anti-autocomplete-shadow`}
										{...field}
										type="lastName"
									/>
								</FormControl>
								{errors.lastName && (
									<p className="text-red-500 text-sm">{errors.lastName.message}</p>
								)}
							</FormItem>
						)}
					/>
					<FormLabel className="text-black">
						Date of Birth
						<div className="flex flex-row w-full">
							<FormField
								control={form.control}
								name="month"
								render={({ field }) => (
									<FormItem className="w-full">
										<Select
											defaultValue={field.value}
											onValueChange={e => {
												field.onChange(e)
												if (submitAttempted) {
													form.trigger()
												}
											}}
										>
											<FormControl>
												<SelectTrigger
													data-testid="monthSelect"
													ref={monthSelectTrigger}
													className={`border-r-0 ${
														// @ts-ignore
														errors.birthDate && 'border-red-500 text-red-500'
													}`}
												>
													<SelectValue />
												</SelectTrigger>
											</FormControl>
											<SelectContent className={`w-[${monthSelectWidth}]`}>
												{months.map((month, idx) => (
													<SelectItem key={idx} value={month}>
														{month}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="day"
								render={({ field }) => (
									<FormItem className="w-full">
										<Select
											defaultValue={field.value}
											onValueChange={e => {
												field.onChange(e)
												if (submitAttempted) {
													form.trigger()
												}
											}}
										>
											<FormControl>
												<SelectTrigger
													data-testid="daySelect"
													className={`border-r-0 ${
														// @ts-ignore
														errors.birthDate && 'border-red-500 text-red-500'
													}`}
												>
													<SelectValue />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												{days.map((day, idx) => (
													<SelectItem key={idx} value={day}>
														{day}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="year"
								render={({ field }) => (
									<FormItem className="w-full">
										<Select
											defaultValue={field.value}
											onValueChange={e => {
												field.onChange(e)
												if (submitAttempted) {
													form.trigger()
												}
											}}
										>
											<FormControl>
												<SelectTrigger
													data-testid="yearSelect"
													className={`${
														// @ts-ignore
														errors.birthDate && 'border-red-500 text-red-500'
													}`}
												>
													<SelectValue />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												{years.map((year, idx) => (
													<SelectItem key={idx} value={year}>
														{year}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									</FormItem>
								)}
							/>
						</div>
						{Object.keys(errors).includes('birthDate') && (
							// @ts-ignore
							<p className="text-red-500 text-sm">{errors.birthDate!.message}</p>
						)}
					</FormLabel>
					<FormField
						control={form.control}
						name="email"
						render={({ field }) => (
							<FormItem>
								<FormLabel className="text-black">Email</FormLabel>
								<FormControl>
									<Input
										className={`
											${errors.email || emailErrorResponse ? 'border-red-500 text-red-500' : ''}
										!anti-autocomplete-shadow`}
										{...field}
										onChange={e => {
											setEmailErrorResponse('')
											field.onChange(e)
										}}
										type="email"
									/>
								</FormControl>
								{emailErrorResponse || errors.email ? (
									emailErrorResponse ? (
										<p className="text-red-500 text-sm">{emailErrorResponse}</p>
									) : (
										<p className="text-red-500 text-sm">{errors.email?.message}</p>
									)
								) : (
									<></>
								)}
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
				</div>
				<Button type="submit">Submit</Button>
				<p className="text-sm">
					Already have an account?{' '}
					<Link href={{ pathname: '/login' }} className="hover:underline">
						Log in
					</Link>
				</p>
			</form>
		</Form>
	)
}

export default SignupForm
