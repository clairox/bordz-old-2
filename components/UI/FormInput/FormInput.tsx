import React from 'react'
import { Input } from '../Input'
import { ControllerRenderProps } from 'react-hook-form'
import { useFormField } from '../Form'

const FormInput = React.forwardRef<HTMLDivElement, ControllerRenderProps>(({ ...props }, ref) => {
    const { error } = useFormField()
    return (
        <div ref={ref}>
            <Input className={`${error && 'border-red-500 text-red-500'}`} {...props} />
            {error && <p className="text-red-500 text-sm">{error?.message as string}</p>}
        </div>
    )
})

FormInput.displayName = 'FormInput'

export default FormInput
