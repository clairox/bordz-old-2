import React from 'react'
import { FormControl, FormField, FormItem, FormLabel } from '../Form'
import { Control } from 'react-hook-form'
import FormInput from '../FormInput'
import FormPasswordInput from '../FormPasswordInput'

type FormInputFieldProps = {
    control: Control<any>
    name: string
    label: string
    type?: 'text' | 'password'
}

const FormInputField = React.forwardRef<HTMLDivElement, FormInputFieldProps>(
    ({ control, type, name, label }, ref) => {
        return (
            <div ref={ref}>
                <FormField
                    control={control}
                    name={name}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-black">{label}</FormLabel>
                            <FormControl>
                                {type === 'password' ? (
                                    <FormPasswordInput {...field} />
                                ) : (
                                    <FormInput {...field} />
                                )}
                            </FormControl>
                        </FormItem>
                    )}
                />
            </div>
        )
    },
)
FormInputField.displayName = 'FormInputField'

export default FormInputField
