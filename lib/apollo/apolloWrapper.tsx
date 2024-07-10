'use client'
import { ApolloLink, HttpLink } from '@apollo/client'
import {
	ApolloClient,
	ApolloNextAppProvider,
	InMemoryCache,
	SSRMultipartLink,
} from '@apollo/experimental-nextjs-app-support'
import React from 'react'

const makeClient = () => {
	const httpLink = new HttpLink({
		uri: process.env.NEXT_PUBLIC_SHOPIFY_BASE_URL,
		headers: {
			'Content-Type': 'application/json',
			'X-Shopify-Storefront-Access-Token': process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN!,
		},
	})

	return new ApolloClient({
		cache: new InMemoryCache({
			typePolicies: {
				Query: {
					fields: {
						products: {
							keyArgs: false,
							merge(existing = [], incoming) {
								return [...existing, ...incoming]
							},
						},
					},
				},
			},
		}),
		link:
			typeof window === 'undefined'
				? ApolloLink.from([new SSRMultipartLink({ stripDefer: true }), httpLink])
				: httpLink,
	})
}

const ApolloWrapper: React.FunctionComponent<React.PropsWithChildren> = ({ children }) => {
	return <ApolloNextAppProvider makeClient={makeClient}>{children}</ApolloNextAppProvider>
}

export { ApolloWrapper }
