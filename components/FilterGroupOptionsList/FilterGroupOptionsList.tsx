import { useDeselectFilterOption, useRefineSearchParams } from '@/hooks'
import { FilterGroup } from '@/types/store'
import { useSearchParams } from 'next/navigation'
import FilterOptionCheckbox from '../FilterOptionCheckbox'
import { useCallback } from 'react'
import { SEARCH_PARAM_SEPARATOR } from '@/lib/utils/constants'
import { CheckedState } from '@radix-ui/react-checkbox'

type FilterGroupOptionsListProps = {
    filterGroup: FilterGroup
}

const FilterGroupOptionsList: React.FunctionComponent<FilterGroupOptionsListProps> = ({
    filterGroup,
}) => {
    const searchParams = useSearchParams()
    const refineSearchParams = useRefineSearchParams()

    const deselectFilterOption = useDeselectFilterOption(searchParams)
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

    const handleToggleFilterOption = (
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

    const groupName = filterGroup.groupName
    return (
        <div className="flex flex-col gap-3">
            {filterGroup.options.map(option => {
                const id = groupName + '-' + option.name
                return (
                    <FilterOptionCheckbox
                        groupName={groupName}
                        option={option}
                        onClick={handleToggleFilterOption}
                        key={id}
                    />
                )
            })}
        </div>
    )
}

export default FilterGroupOptionsList
