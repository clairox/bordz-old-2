'use client'
import React from 'react'
import { permanentRedirect, useSearchParams } from 'next/navigation'
import LoginForm from '@/components/Forms/LoginForm'
import SignupForm from '@/components/Forms/SignupForm'
import { useAuth } from '@/context/AuthContext/AuthContext'

const Page = () => {
	const searchParams = useSearchParams()
	const { loadState } = useAuth()

	switch (loadState) {
		case 'idle':
			return <>Loading...</>
		case 'loading':
			return <>Loading...</>
		case 'succeeded':
			permanentRedirect('/')
		case 'failed':
			if (searchParams.get('register')) {
				return <SignupForm />
			} else {
				return <LoginForm />
			}
		default:
			return <></>
	}
}

export default Page
