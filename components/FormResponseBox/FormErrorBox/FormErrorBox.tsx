'use client'
import { WarningCircle } from '@phosphor-icons/react'
import React, { PropsWithChildren } from 'react'

const FormErrorBox: React.FunctionComponent<PropsWithChildren> = ({ children }) => {
	return (
		<div
			className="flex flex-row gap-4 justify-center items-center px-4 w-full h-[75px] bg-red-200 text-sm"
			data-testid="formErrorBox"
		>
			<WarningCircle size={50} weight="regular" />
			{children}
		</div>
	)
}

export default FormErrorBox
