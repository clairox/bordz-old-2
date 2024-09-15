import React from 'react'
import { ControllerRenderProps } from 'react-hook-form'
import { useFormField } from '../Form'
import DateSelect from '../DateSelect'
import { DateSelectProps } from '@/types'

type FormDateSelectProps = ControllerRenderProps & DateSelectProps

const FormDateSelect = React.forwardRef<HTMLDivElement, FormDateSelectProps>(
    ({ ...props }, ref) => {
        const { error } = useFormField()

        return (
            <div ref={ref}>
                <DateSelect className={`${error && 'border-red-500 text-red-500'}`} {...props} />
                {error && <p className="text-red-500 text-sm">{error?.message as string}</p>}
            </div>
        )
    },
)

FormDateSelect.displayName = 'FormDateSelect'

export default FormDateSelect
