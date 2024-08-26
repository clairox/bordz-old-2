import React, { useState } from 'react'
import { Input } from '@/components/UI/Input'
import { Eye, EyeSlash } from '@phosphor-icons/react'
import { ControllerRenderProps } from 'react-hook-form'
import { useFormField } from '../Form'

const FormPasswordInput = React.forwardRef<HTMLDivElement, ControllerRenderProps>(
    ({ ...props }, ref) => {
        const { error } = useFormField()

        const [isPasswordVisible, setIsPasswordVisible] = useState(false)

        const togglePasswordVisibility = () => {
            if (isPasswordVisible) {
                return setIsPasswordVisible(false)
            }

            return setIsPasswordVisible(true)
        }

        return (
            <div ref={ref}>
                <div className="relative flex items-center">
                    <Input
                        {...props}
                        className={`pr-16 ${error && 'border-red-500 text-red-500'}`}
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
                {error && <p className="text-red-500 text-sm">{error?.message as string}</p>}
            </div>
        )
    },
)
FormPasswordInput.displayName = 'FormPasswordInput'

export default FormPasswordInput
