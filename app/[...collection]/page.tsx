'use client'
import { useState } from 'react'
import CollectionHeader from '@/components/CollectionHeader'
import { useParams, useSearchParams } from 'next/navigation'
import Heading from '@/components/UI/Heading'
import _ from 'lodash'
import { Button } from '@/components/UI/Button'
import { Sidebar } from '@/components/UI/Sidebar'
import { BreadcrumbTrail, Collection, ProductListItem } from '@/types/store'
import { ProductGrid } from '@/components/UI/ProductGrid'
import PriceRangeSlider from '@/components/UI/PriceRangeSlider'
import FilterChips from '@/components/UI/FilterChips'
import { useCollectionQuery } from '@/hooks'
import FilterGroupOptionsList from '@/components/FilterGroupOptionsList'
import CollectionProductListItem from '@/components/CollectionProductListItem/CollectionProductListItem'
import Breadcrumb from '@/components/Breadcrumb'

const Page = () => {
    const params = useParams()
    const searchParams = useSearchParams()
    const { data, error, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage, status } =
        useCollectionQuery(params.collection[0], searchParams)

    const [openRefinements, setOpenRefinements] = useState<string[]>([])

    if (error) {
        console.error(error)
        return <></>
    }

    if (isFetching && status !== 'success') {
        return <>Loading...</>
    }

    const {
        title,
        totalProductCount,
        filterGroups,
        priceFilter,
        maxPrice,
        relatedCollections,
        department,
    }: Collection = data!.pages[data!.pages.length - 1]

    const trail: BreadcrumbTrail = {
        home: { title: 'Home', href: '/', parent: null },
        department: department
            ? {
                  title: department,
                  href: '/' + department.toLowerCase().replace(' ', '-'),
                  parent: 'home',
              }
            : null,
        collection: { title, href: null, parent: department ? 'department' : 'home' },
    }

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

    // TODO: add sort select on bottom right of CollectionHeader
    return (
        <div className="w-full h-full">
            <CollectionHeader>
                <div className="flex flex-col gap-5 pl-5 py-5">
                    <div className="pl-1">
                        <Breadcrumb endNode={trail.collection!} trail={trail} />
                    </div>
                    <Heading>{title}</Heading>
                    {relatedCollections && (
                        <div className="flex gap-6">
                            {relatedCollections.map(collection => {
                                return (
                                    <CollectionHeader.Link
                                        href={'/' + collection.handle}
                                        key={collection.title}
                                    >
                                        {collection.title}
                                    </CollectionHeader.Link>
                                )
                            })}
                        </div>
                    )}
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

export default Page
