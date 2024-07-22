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
				className={props.className + ' pr-14'}
				type={isPasswordVisible ? 'text' : 'password'}
				data-testid="passwordInput"
			/>
			<span
				className="absolute right-[18px]  text-gray-700 cursor-pointer"
				onClick={togglePasswordVisibility}
				data-testid="showHideButton"
			>
				{isPasswordVisible ? (
					<Eye size={23} weight="light" data-testid="eyeIcon" />
				) : (
					<EyeSlash size={23} weight="light" data-testid="eyeSlashIcon" />
				)}
			</span>
		</div>
	)
})
PasswordInput.displayName = 'PasswordInput'

export default PasswordInput
