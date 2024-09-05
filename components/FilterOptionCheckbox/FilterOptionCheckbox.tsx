import { CheckedState } from '@radix-ui/react-checkbox'
import { Checkbox } from '../UI/Checkbox'
import { SEARCH_PARAM_SEPARATOR } from '@/lib/utils/constants'
import { useCallback } from 'react'
import { FilterOption } from '@/types/store'

type FilterOptionCheckboxProps = {
    groupName: string
    option: FilterOption
    searchParams: URLSearchParams
    refineSearchParams: (searchParams: URLSearchParams) => void
}

const FilterOptionCheckbox: React.FunctionComponent<FilterOptionCheckboxProps> = ({
    groupName,
    option,
    searchParams,
    refineSearchParams,
}) => {
    const id = groupName + '-' + option.name

    const selectFilterOption = useCallback(
        (groupName: string, optionName: string) => {
            const optionNames = searchParams.get(groupName)
            let updatedOptionNames = optionName

            if (optionNames) {
                updatedOptionNames = optionNames + SEARCH_PARAM_SEPARATOR + optionName
            }

            const newSearchParams = new URLSearchParams(searchParams)

            newSearchParams.set(groupName, updatedOptionNames)

            newSearchParams.delete('cursor')

            refineSearchParams(newSearchParams)
        },
        [searchParams, refineSearchParams],
    )

    const deselectFilterOption = useCallback(
        (groupName: string, optionName: string) => {
            const optionNames = searchParams.get(groupName)
            if (optionNames == undefined) {
                refineSearchParams(searchParams)
                return
            }

            const optionNamesArray = optionNames.split(SEARCH_PARAM_SEPARATOR)
            let updatedOptionNames = optionNamesArray
                .filter(name => name !== optionName)
                .join(SEARCH_PARAM_SEPARATOR)

            const newSearchParams = new URLSearchParams(searchParams)

            if (updatedOptionNames === '') {
                newSearchParams.delete(groupName)
            } else {
                newSearchParams.set(groupName, updatedOptionNames)
            }

            newSearchParams.delete('cursor')

            refineSearchParams(newSearchParams)
        },
        [searchParams, refineSearchParams],
    )

    const handleFilterOptionToggle = (
        newCheckedState: CheckedState,
        groupName: string,
        optionName: string,
    ) => {
        if (newCheckedState === true) {
            selectFilterOption(groupName, optionName)
        } else {
            deselectFilterOption(groupName, optionName)
        }
    }

    return (
        <div className="flex gap-2">
            <Checkbox
                id={id}
                checked={option.isSelected}
                onCheckedChange={state => handleFilterOptionToggle(state, groupName, option.name)}
            />
            <label className="leading-4" htmlFor={id}>
                {option.name}
            </label>
        </div>
    )
}

export default FilterOptionCheckbox
