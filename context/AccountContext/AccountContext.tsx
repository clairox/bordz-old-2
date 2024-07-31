'use client'
import { GetCustomerQuery } from '@/__generated__/graphql'
import React, { createContext, useContext } from 'react'
import { Customer, toSafeCustomer } from './utils'

const AccountContext = createContext<GetCustomerQuery['customer'] | undefined>(undefined)

export const AccountProvider: React.FunctionComponent<
	React.PropsWithChildren<{ customer: GetCustomerQuery['customer'] }>
> = ({ customer, children }) => (
	<AccountContext.Provider value={customer}>{children}</AccountContext.Provider>
)

type AccountContextType = {
	customer: Customer
}

export const useAccountContext = (): AccountContextType => {
	const customer = useContext(AccountContext)

	if (customer === undefined) {
		throw new Error('useAccountContext cannot be used outside of AccountContext')
	}

	const safeCustomer = toSafeCustomer(customer)
	if (safeCustomer === null) {
		throw new Error('Customer is null')
	}

	return {
		customer: safeCustomer,
	}
}
