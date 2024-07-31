import { renderHook } from '@testing-library/react'
import { AccountProvider, useAccountContext } from './AccountContext'
import React from 'react'

const currentDate = Date.now()

const customer = {
	acceptsMarketing: false,
	addresses: { nodes: [] },
	createdAt: new Date(currentDate),
	displayName: 'Tess Name',
	email: 'tess@ema.il',
	firstName: 'Tess',
	id: 'test id',
	lastName: 'Name',
	numberOfOrders: 0,
	orders: { nodes: [], totalCount: 0 },
	tags: [],
	updatedAt: new Date(currentDate),
}

describe('AccountContext', () => {
	it('returns valid Customer object', () => {
		const wrapper = ({ children }: { children: React.ReactNode }) => (
			<AccountProvider customer={customer}>{children}</AccountProvider>
		)
		const { result } = renderHook(() => useAccountContext(), { wrapper })
		expect(result.current).toEqual({
			customer: {
				acceptsMarketing: false,
				addresses: [],
				createdAt: new Date(currentDate),
				displayName: 'Tess Name',
				email: 'tess@ema.il',
				firstName: 'Tess',
				id: 'test id',
				lastName: 'Name',
				numberOfOrders: 0,
				orders: [],
				tags: [],
				updatedAt: new Date(currentDate),
			},
		})
	})
})
