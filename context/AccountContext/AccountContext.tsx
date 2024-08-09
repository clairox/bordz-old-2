'use client'
import { fetcher } from '@/lib/fetcher'
import { FetcherError } from '@/lib/fetcher/fetcher'
import { Customer, UpdatePersonalInfoValues } from '@/types/store'
import { usePathname, useRouter } from 'next/navigation'
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react'

type AccountContextValue = {
	customer: Customer
	updatePersonalInfo: (values: UpdatePersonalInfoValues) => Promise<boolean>
	updatePassword: (password: string) => Promise<boolean>
	deleteCustomer: () => Promise<boolean>
	loading: boolean
}

const defaultCustomer: Customer = {
	acceptsMarketing: false,
	addresses: [],
	createdAt: new Date(0),
	displayName: '',
	email: '',
	firstName: '',
	id: '',
	lastName: '',
	numberOfOrders: 0,
	orders: [],
	tags: [],
	updatedAt: new Date(0),
	cartId: '',
	birthDate: new Date(0),
	wishlist: [],
}

const AccountContext = createContext<AccountContextValue>({
	customer: defaultCustomer,
	updatePersonalInfo: async (values: UpdatePersonalInfoValues) => false,
	updatePassword: async (password: string) => false,
	deleteCustomer: async () => false,
	loading: true,
})

export const useAccountContext = () => useContext(AccountContext)

export const AccountProvider: React.FunctionComponent<React.PropsWithChildren> = ({ children }) => {
	const router = useRouter()
	const pathname = usePathname()

	const [customer, setCustomer] = useState<Customer | undefined>(undefined)
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		if (customer == undefined) {
			setLoading(true)
			fetcher('/customer')
				.then(response => {
					const customer: Customer = response.data
					setCustomer(customer)
					setLoading(false)
				})
				.catch(error => {
					router.replace('/login')
				})
		}
	}, [customer, router])

	const updatePersonalInfo = useCallback(
		async (values: UpdatePersonalInfoValues): Promise<boolean> => {
			const config = {
				method: 'PATCH',
				body: JSON.stringify(values),
			}

			try {
				const response = await fetcher('/customer', config)

				const updatedCustomer: Customer = response.data
				setCustomer(updatedCustomer)

				return true
			} catch (error) {
				if (error instanceof FetcherError) {
					if (error.response.status === 401) {
						throw new Error('Session expired')
					} else {
						throw new Error(error.response.data.message)
					}
				} else {
					throw error
				}
			}
		},
		[]
	)

	const updatePassword = useCallback(async (password: string): Promise<boolean> => {
		const config = {
			method: 'PATCH',
			body: JSON.stringify({ password }),
		}

		try {
			const response = await fetcher('/customer', config)

			const updatedCustomer: Customer = response.data
			setCustomer(updatedCustomer)

			return true
		} catch (error) {
			if (error instanceof FetcherError) {
				if (error.response.status === 401) {
					throw new Error('Session expired')
				} else {
					throw new Error(error.response.data.message)
				}
			} else {
				throw error
			}
		}
	}, [])

	const deleteCustomer = useCallback(async (): Promise<boolean> => {
		if (customer == undefined) {
			return false
		}

		const config = {
			method: 'DELETE',
			body: JSON.stringify({ id: customer.id }),
		}

		try {
			await fetcher('/customer', config)
			return true
		} catch (error) {
			if (error instanceof FetcherError) {
				if (error.response.status === 401) {
					throw new Error('Session expired')
				} else {
					throw new Error(error.response.data.message)
				}
			} else {
				throw error
			}
		}
	}, [customer])

	if (customer == undefined) {
		return <>Loading...</>
	}

	return (
		<AccountContext.Provider
			value={{ customer, updatePersonalInfo, updatePassword, deleteCustomer, loading }}
		>
			{children}
		</AccountContext.Provider>
	)
}
