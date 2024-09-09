import {
    useDeselectFilterOption,
    useRefineCollectionSearchParams,
    useSetPriceFilter,
} from '@/hooks'
import { FilterGroup } from '@/types/store'
import { X } from '@phosphor-icons/react/dist/ssr'
import { useSearchParams } from 'next/navigation'
import { FunctionComponent, PropsWithChildren, useCallback } from 'react'

type FilterChipsProps = {
    filterGroups: FilterGroup[]
    totalProductCount: number
    maxPrice: number
}
const FilterChips: FunctionComponent<FilterChipsProps> = ({
    filterGroups,
    totalProductCount,
    maxPrice,
}) => {
    const searchParams = useSearchParams()
    const deselectFilterOption = useDeselectFilterOption(searchParams)
    const setPriceFilter = useSetPriceFilter(searchParams)

    const deselectFilter = useCallback(
        (groupName: string, optionName: string) => {
            if (groupName === 'price') {
                setPriceFilter([0, maxPrice])
                return
            }

            deselectFilterOption(groupName, optionName)
        },
        [deselectFilterOption, maxPrice, setPriceFilter],
    )

    const refineSearchParams = useRefineCollectionSearchParams()
    const reset = useCallback(() => {
        const keys = Array.from(searchParams.keys())
        const newSearchParams = new URLSearchParams(searchParams)
        keys.forEach(key => {
            if (key !== 'sortBy') {
                newSearchParams.delete(key)
            }
        })

        refineSearchParams(newSearchParams)
    }, [searchParams, refineSearchParams])

    // TODO: Sort chips
    const chipsGroups: React.ReactNode[] = []
    const makeChips = () => {
        const activeFilterGroups = filterGroups.filter(group => group.isActive)

        const activeGroupsWithSelectedOptions: FilterGroup[] = []
        activeFilterGroups.forEach(group => {
            const groupWithSelectedOptions = group
            groupWithSelectedOptions.options = group.options.filter(option => option.isSelected)

            activeGroupsWithSelectedOptions.push(groupWithSelectedOptions)
        })

        activeGroupsWithSelectedOptions.forEach(group => {
            chipsGroups.push(
                group.options.map(option => (
                    <Chip
                        onClick={() => deselectFilter(group.groupName, option.name)}
                        key={group.groupName + option.name}
                    >
                        {option.name}
                    </Chip>
                )),
            )
        })

        return chipsGroups
    }

    makeChips()

    return (
        <div className="px-4 py-2">
            <div className="flex justify-between w-full">
                <div>{`${totalProductCount} ${totalProductCount === 1 ? 'item' : 'items'}`}</div>
                {chipsGroups.length > 0 && (
                    <button className="hover:underline" onClick={reset}>
                        Reset
                    </button>
                )}
            </div>
            {chipsGroups.length > 0 && (
                <div className="flex flex-col gap-2 pt-4">
                    {chipsGroups.map((group, idx) => (
                        <div key={idx} className="flex flex-wrap gap-2">
                            {group}
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

type ChipProps = PropsWithChildren<{
    onClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
}>

const Chip: FunctionComponent<ChipProps> = ({ children, onClick }) => {
    return (
        <button
            className="flex gap-2 justify-center items-center px-2 py-4 h-6 rounded-md bg-black font-semibold text-white text-sm"
            onClick={onClick}
        >
            {children}
            <X size={16} weight="bold" />
        </button>
    )
}

export default FilterChips
