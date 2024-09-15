import { FunctionComponent } from 'react'
import { Control } from 'react-hook-form'
import { FormControl, FormField, FormItem, FormLabel } from '../Form'
import { DateSelectProps } from '@/types'
import FormDateSelect from '../FormDateSelect'

type FormDateSelectFieldProps = Pick<DateSelectProps, 'minYear' | 'maxYear'> & {
    control: Control<any>
    name: string
    label: string
}

const FormDateSelectField: FunctionComponent<FormDateSelectFieldProps> = ({
    control,
    name,
    label,
    ...props
}) => {
    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem>
                    <FormLabel className="text-black">{label}</FormLabel>
                    <FormControl>
                        <FormDateSelect {...field} {...props} />
                    </FormControl>
                </FormItem>
            )}
        />
    )
}

export default FormDateSelectField
