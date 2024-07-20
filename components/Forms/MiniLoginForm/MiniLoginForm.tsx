'use client'
import React from 'react'
import { FieldValues, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import MiniLoginFormSchema from './schema'
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/Form'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'

type FormData = z.infer<typeof MiniLoginFormSchema>

const MiniLoginForm = () => {
	const form = useForm<FormData>({
		resolver: zodResolver(MiniLoginFormSchema),
		defaultValues: {
			email: '',
			password: '',
		},
	})

	const onSubmit = (data: FormData) => {
		console.log(data)
	}

	return (
		<Form {...form}>
			<h1 className="mb-2 text-xl font-semibold">Login</h1>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
				<div className="space-y-3">
					<FormField
						control={form.control}
						name="email"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Email</FormLabel>
								<FormControl>
									<Input {...field} type="email" />
								</FormControl>
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="password"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Password</FormLabel>
								<FormControl>
									<Input {...field} type="password" />
								</FormControl>
							</FormItem>
						)}
					/>
				</div>
				<Button type="submit">Submit</Button>
			</form>
		</Form>
	)
}

export default MiniLoginForm
