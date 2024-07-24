import React from 'react'
import LoginForm from '@/components/Forms/LoginForm'
import SignupForm from '@/components/Forms/SignupForm'
import { redirect } from 'next/navigation'
import { isAuthenticated } from '@/lib/utils/ssr'

const Page: React.FunctionComponent<{
	searchParams: { [key: string]: string }
}> = ({ searchParams }) => {
	if (isAuthenticated()) {
		redirect('/')
	}

	if (searchParams.register) {
		return <SignupForm />
	}

	return <LoginForm />
}

export default Page
