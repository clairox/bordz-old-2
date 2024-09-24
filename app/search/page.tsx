'use client'
import { useState } from 'react'
import { useSearchQuery } from '@/hooks'
import { useSearchParams } from 'next/navigation'
import { ProductListItem, ProductSearchResults } from '@/types/store'
import CollectionHeader from '@/components/CollectionHeader'
import Heading from '@/components/UI/Heading'
import { Sidebar } from '@/components/UI/Sidebar'
import FilterChips from '@/components/UI/FilterChips'
import _ from 'lodash'
import FilterGroupOptionsList from '@/components/FilterGroupOptionsList'
import PriceRangeSlider from '@/components/UI/PriceRangeSlider'
import { ProductGrid } from '@/components/UI/ProductGrid'
import CollectionProductListItem from '@/components/CollectionProductListItem'
import { Button } from '@/components/UI/Button'

const SearchPage = () => {
    const searchParams = useSearchParams()
    const query = searchParams.get('q') || ''
    const { data, error, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage, status } =
        useSearchQuery(searchParams)

    const [openRefinements, setOpenRefinements] = useState<string[]>([])

    if (error) {
        console.error(error)
        return <></>
    }

    if (isFetching && status !== 'success') {
        return <>Loading...</>
    }

    if (data!.pages[0].products.length === 0) {
        return (
            <div className="w-full">
                <CollectionHeader>
                    <div className="flex flex-col gap-5 px-5 pt-10 pb-5">
                        <div className="flex justify-between items-center">
                            <Heading>{`"${query}"`}</Heading>
                            <CollectionHeader.Select />
                        </div>
                    </div>
                </CollectionHeader>

                <div className="py-10 text-center">
                    <p className="text-2xl font-semibold">No results for {`"${query}"`}</p>
                </div>
            </div>
        )
    }

    const { totalProductCount, filterGroups, priceFilter, maxPrice }: ProductSearchResults =
        data!.pages[data!.pages.length - 1]

    const filterGroupsWithPriceFilter =
        priceFilter[0] !== 0 || priceFilter[1] !== maxPrice
            ? [
                  ...filterGroups,
                  {
                      groupName: 'price',
                      isActive: true,
                      options: [
                          { name: `$${priceFilter[0]} - $${priceFilter[1]}`, isSelected: true },
                      ],
                  },
              ]
            : filterGroups

    const products: ProductListItem[] = []
    data!.pages.forEach(item => item.products.forEach(product => products.push(product)))

    return (
        <div className="w-full h-full">
            <CollectionHeader>
                <div className="flex flex-col gap-5 px-5 pt-8 pb-5">
                    <div className="flex justify-between items-center">
                        <Heading>{`"${query}"`}</Heading>
                        <CollectionHeader.Select />
                    </div>
                </div>
            </CollectionHeader>
            <div className="grid grid-cols-5 w-full h-full">
                <Sidebar>
                    <FilterChips
                        filterGroups={filterGroupsWithPriceFilter}
                        totalProductCount={totalProductCount}
                        maxPrice={maxPrice}
                    />
                    <Sidebar.Menu value={openRefinements} onValueChange={setOpenRefinements}>
                        {filterGroups.map(filterGroup => {
                            const { groupName } = filterGroup
                            return (
                                <Sidebar.MenuItem
                                    title={_.capitalize(groupName)}
                                    key={groupName}
                                    value={groupName}
                                >
                                    <Sidebar.MenuContent>
                                        <FilterGroupOptionsList filterGroup={filterGroup} />
                                    </Sidebar.MenuContent>
                                </Sidebar.MenuItem>
                            )
                        })}
                        <Sidebar.MenuItem title={'Price'} value={'price'}>
                            <Sidebar.MenuContent>
                                <PriceRangeSlider
                                    initialValue={priceFilter}
                                    min={0}
                                    max={maxPrice}
                                />
                            </Sidebar.MenuContent>
                        </Sidebar.MenuItem>
                    </Sidebar.Menu>
                </Sidebar>
                <div className="col-span-4 w-full">
                    <ProductGrid>
                        {products.map(product => {
                            return <CollectionProductListItem product={product} key={product.id} />
                        })}
                    </ProductGrid>
                    <div className="flex flex-col gap-4 items-center py-10">
                        Showing {products.length} of {totalProductCount} products
                        {hasNextPage && !isFetchingNextPage && (
                            <Button onClick={() => fetchNextPage()}>Load More</Button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SearchPage
