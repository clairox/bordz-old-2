import React, { useState } from 'react'
import { Input } from '@/components/ui/Input'
import { Eye, EyeSlash } from '@phosphor-icons/react'

const PasswordInput = React.forwardRef<
	HTMLInputElement,
	React.InputHTMLAttributes<HTMLInputElement>
>((props, ref) => {
	const [isPasswordVisible, setIsPasswordVisible] = useState(false)

	const togglePasswordVisibility = () => {
		if (isPasswordVisible) {
			return setIsPasswordVisible(false)
		}

		return setIsPasswordVisible(true)
	}

	return (
		<div className="relative flex items-center">
			<Input
				ref={ref}
				{...props}
				className="pr-14"
				type={isPasswordVisible ? 'text' : 'password'}
			/>
			<span
				className="absolute right-[18px]  text-gray-700 cursor-pointer"
				onClick={togglePasswordVisibility}
			>
				{isPasswordVisible ? (
					<Eye size={23} weight="light" />
				) : (
					<EyeSlash size={23} weight="light" />
				)}
			</span>
		</div>
	)
})
PasswordInput.displayName = 'PasswordInput'

export default PasswordInput
