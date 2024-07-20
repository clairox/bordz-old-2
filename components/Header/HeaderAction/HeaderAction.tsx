'use client'
import React, { useState } from 'react'

const HeaderAction = React.forwardRef<
	HTMLButtonElement,
	{
		triggered?: boolean
		children: React.ReactNode
	}
>(({ triggered = false, children, ...props }, ref) => {
	const [hovering, setHovering] = useState(false)
	return (
		<button
			{...props}
			onMouseEnter={() => setHovering(true)}
			onMouseLeave={() => setHovering(false)}
			ref={ref}
			className={`flex justify-center items-center h-full border-l border-black ${
				triggered ? 'cursor-default' : 'border-b'
			} ${hovering && !triggered ? 'bg-gray-100' : 'bg-white'}`}
		>
			<div className="px-[18px]">{children}</div>
		</button>
	)
})
HeaderAction.displayName = 'HeaderAction'

export default HeaderAction
