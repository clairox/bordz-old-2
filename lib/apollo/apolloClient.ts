import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client'
import { registerApolloClient } from '@apollo/experimental-nextjs-app-support'

const { getClient, PreloadQuery } = registerApolloClient(() => {
	return new ApolloClient({
		cache: new InMemoryCache(),
		link: new HttpLink({
			uri: process.env.NEXT_PUBLIC_SHOPIFY_BASE_URL,
			headers: {
				'Content-Type': 'application/json',
				'X-Shopify-Storefront-Access-Token':
					process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN!,
			},
		}),
	})
})

export { getClient, PreloadQuery }
