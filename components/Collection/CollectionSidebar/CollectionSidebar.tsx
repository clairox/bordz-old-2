'use client'
import React, { useMemo } from 'react'
import _ from 'lodash'
import {
    CollectionSidebarMenu,
    CollectionSidebarMenuItem,
    CollectionSidebarMenuItemContent,
} from '../CollectionSidebarMenu'
import PriceRangeSlider from '@/components/UI/PriceRangeSlider'
import CollectionSidebarHeader from '../CollectionSidebarHeader/CollectionSidebarHeader'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import useProductFilters from '@/hooks/useProductFilters'
import type { FilterTag } from '@/types'

const CollectionSidebar: React.FunctionComponent<{
    maxPrice: number
    openRefinements: string[]
    setOpenRefinements: (refinements: string[]) => void
}> = ({ maxPrice, openRefinements, setOpenRefinements }) => {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const sortByParam = searchParams.get('sortBy')

    const {
        filters,
        selectedFilters,
        selectToggleableFilter,
        deselectToggleableFilter,
        updatePriceFilter,
        removePriceFilter,
        clearAllFilters,
        loading,
    } = useProductFilters(searchParams)
    const minPrice = 0

    const currentPriceRange = useMemo(() => {
        return selectedFilters?.get('price')?.map(value => Number(value)) || [minPrice, maxPrice]
    }, [minPrice, maxPrice, selectedFilters])

    const toggleToggleableFilter = (
        key: string,
        value: string,
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const newChecked = event.target.checked
        if (newChecked) {
            return selectToggleableFilter(key, value)
        }
        return deselectToggleableFilter(key, value)
    }

    const sortBy = (sortByParam: string) => {
        const newParams = new URLSearchParams(searchParams)
        newParams.set('sortBy', sortByParam)
        newParams.delete('start')

        const url = pathname + '?' + newParams.toString()
        router.replace(url, { scroll: false })
    }

    const filterTags: FilterTag[] = useMemo(() => {
        if (selectedFilters == undefined) {
            return []
        }
        const keys = Array.from(selectedFilters.keys())
        const filterTags: FilterTag[] = []

        keys.forEach(key => {
            const values = selectedFilters.get(key)!
            if (key === 'price') {
                filterTags.push({
                    label: `$${values[0]} - $${values[1]}`,
                    key,
                    value: values,
                })
            } else {
                values.forEach(value => {
                    filterTags.push({
                        label: value,
                        key,
                        value,
                    })
                })
            }
        })

        return filterTags
    }, [selectedFilters])

    const setPriceFilter = (value: number[]) => {
        if (_.isEqual(value, [minPrice, maxPrice])) {
            removePriceFilter()
        } else {
            updatePriceFilter(value)
        }
    }

    const unsetFilter = (key: string, value: string | string[]) => {
        if (typeof value === 'string') {
            deselectToggleableFilter(key, value)
        } else {
            removePriceFilter()
        }
    }

    return (
        <div className="relative">
            {loading && <div className="z-[10] absolute w-full h-full bg-white opacity-50" />}
            <CollectionSidebarHeader
                filterTags={filterTags}
                unsetFilter={unsetFilter}
                clearFilters={clearAllFilters}
            />

            <CollectionSidebarMenu
                openRefinements={openRefinements}
                setOpenRefinements={setOpenRefinements}
            >
                <CollectionSidebarMenuItem title={'Sort'}>
                    <div>
                        <div className="pl-6 py-1">
                            <input
                                type="radio"
                                className="appearance-none"
                                id="sortByRecommended"
                                name="sortBy"
                                value="recommended"
                                checked={sortByParam === 'recommended' || sortByParam === null}
                                onChange={e => sortBy(e.target.value)}
                            />
                            <label
                                className={`${
                                    sortByParam === 'recommended' || !sortByParam
                                        ? 'font-semibold'
                                        : 'hover:underline cursor-pointer'
                                }`}
                                htmlFor="sortByRecommended"
                            >
                                Recommended
                            </label>
                        </div>
                        <div className="pl-6 py-1">
                            <input
                                type="radio"
                                className="appearance-none"
                                id="sortByNewest"
                                name="sortBy"
                                value="newest"
                                checked={sortByParam === 'newest'}
                                onChange={e => sortBy(e.target.value)}
                            />
                            <label
                                className={`${
                                    sortByParam === 'newest'
                                        ? 'font-semibold'
                                        : 'hover:underline cursor-pointer'
                                }`}
                                htmlFor="sortByNewest"
                            >
                                Newest
                            </label>
                        </div>
                        <div className="pl-6 py-1">
                            <input
                                type="radio"
                                className="appearance-none"
                                id="sortByPriceLowToHigh"
                                name="sortBy"
                                value="priceLowToHigh"
                                checked={sortByParam === 'priceLowToHigh'}
                                onChange={e => sortBy(e.target.value)}
                            />
                            <label
                                className={`${
                                    sortByParam === 'priceLowToHigh'
                                        ? 'font-semibold'
                                        : 'hover:underline cursor-pointer'
                                }`}
                                htmlFor="sortByPriceLowToHigh"
                            >
                                Price: Low to High
                            </label>
                        </div>
                        <div className="pl-6 py-1">
                            <input
                                type="radio"
                                className="appearance-none"
                                id="sortByPriceHighToLow"
                                name="sortBy"
                                value="priceHighToLow"
                                checked={sortByParam === 'priceHighToLow'}
                                onChange={e => sortBy(e.target.value)}
                            />
                            <label
                                className={`${
                                    sortByParam === 'priceHighToLow'
                                        ? 'font-semibold'
                                        : 'hover:underline cursor-pointer'
                                }`}
                                htmlFor="sortByPriceHighToLow"
                            >
                                Price: High to Low
                            </label>
                        </div>
                    </div>
                </CollectionSidebarMenuItem>
                <CollectionSidebarMenuItem title={'Brand'}>
                    <CollectionSidebarMenuItemContent
                        filterKey={'brand'}
                        values={filters?.get('brand')}
                        selectedValues={selectedFilters?.get('brand')}
                        handleFilterToggle={toggleToggleableFilter}
                    />
                </CollectionSidebarMenuItem>
                <CollectionSidebarMenuItem title={'Size'}>
                    <CollectionSidebarMenuItemContent
                        filterKey={'size'}
                        values={filters?.get('size')}
                        selectedValues={selectedFilters?.get('size')}
                        handleFilterToggle={toggleToggleableFilter}
                    />
                </CollectionSidebarMenuItem>
                <CollectionSidebarMenuItem title={'Color'}>
                    <CollectionSidebarMenuItemContent
                        filterKey={'color'}
                        values={filters?.get('color')}
                        selectedValues={selectedFilters?.get('color')}
                        handleFilterToggle={toggleToggleableFilter}
                    />
                </CollectionSidebarMenuItem>
                <CollectionSidebarMenuItem title={'Price'}>
                    <div className="mx-5">
                        <PriceRangeSlider
                            setValue={setPriceFilter}
                            initialValue={currentPriceRange}
                            min={minPrice}
                            max={maxPrice}
                        />
                    </div>
                </CollectionSidebarMenuItem>
            </CollectionSidebarMenu>
        </div>
    )
}

export default CollectionSidebar
