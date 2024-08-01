/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: false,
	images: {
		domains: ['cdn.shopify.com'],
	},
	output: 'standalone',
}

export default nextConfig
