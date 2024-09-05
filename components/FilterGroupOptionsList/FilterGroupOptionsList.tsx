import { useRefineCollectionSearchParams } from '@/hooks'
import { FilterGroup } from '@/types/store'
import { useSearchParams } from 'next/navigation'
import FilterOptionCheckbox from '../FilterOptionCheckbox'

type FilterGroupOptionsListProps = {
    filterGroup: FilterGroup
}

const FilterGroupOptionsList: React.FunctionComponent<FilterGroupOptionsListProps> = ({
    filterGroup,
}) => {
    const searchParams = useSearchParams()
    const refineSearchParams = useRefineCollectionSearchParams()

    const groupName = filterGroup.groupName
    return (
        <div className="flex flex-col gap-3">
            {filterGroup.options.map(option => {
                const id = groupName + '-' + option.name
                return (
                    <FilterOptionCheckbox
                        groupName={groupName}
                        option={option}
                        searchParams={searchParams}
                        refineSearchParams={refineSearchParams}
                        key={id}
                    />
                )
            })}
        </div>
    )
}

export default FilterGroupOptionsList
