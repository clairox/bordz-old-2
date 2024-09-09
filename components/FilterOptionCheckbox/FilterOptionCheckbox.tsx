import { CheckedState } from '@radix-ui/react-checkbox'
import { Checkbox } from '../UI/Checkbox'
import { FilterOption } from '@/types/store'

type FilterOptionCheckboxProps = {
    groupName: string
    option: FilterOption
    onClick: (newCheckedState: CheckedState, groupName: string, optionName: string) => void
}

const FilterOptionCheckbox: React.FunctionComponent<FilterOptionCheckboxProps> = ({
    groupName,
    option,
    onClick,
}) => {
    const id = groupName + '-' + option.name

    return (
        <div className="flex gap-2">
            <Checkbox
                id={id}
                checked={option.isSelected}
                onCheckedChange={state => onClick(state, groupName, option.name)}
            />
            <label className="leading-4" htmlFor={id}>
                {option.name}
            </label>
        </div>
    )
}

export default FilterOptionCheckbox
