import { House } from '@phosphor-icons/react/dist/ssr'
import React from 'react'

const Addresses = () => {
	return (
		<div>
			<div className="w-full">
				<h1 className="flex items-end gap-4 pl-5 pb-6 h-32 border-r border-b border-black text-4xl font-bold">
					<House size={40} weight="regular" />
					Shipping Addresses
				</h1>
			</div>
			<div className="w-[500px]">Hello</div>
		</div>
	)
}

export default Addresses
