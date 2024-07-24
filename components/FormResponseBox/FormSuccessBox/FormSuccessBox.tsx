'use client'
import { Check } from '@phosphor-icons/react'
import React, { PropsWithChildren } from 'react'

const FormSuccessBox: React.FunctionComponent<PropsWithChildren> = ({ children }) => {
	return (
		<div
			className="flex flex-row gap-4 justify-center items-center px-4 w-full h-[75px] bg-green-200 text-sm"
			data-testid="formSuccessBox"
		>
			<Check size={50} weight="regular" />
			{children}
		</div>
	)
}

export default FormSuccessBox

// TODO: Use server
