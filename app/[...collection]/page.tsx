'use client'
import { useState } from 'react'
import CollectionHeader from '@/components/Collection/CollectionHeader'
import { useSearchParams } from 'next/navigation'
import { useCollection } from '@/hooks/useCollection'
import Heading from '@/components/UI/Heading'
import { Breadcrumb, BreadcrumbList } from '@/components/UI/Breadcrumb'
import { Checkbox } from '@/components/UI/Checkbox'
import _ from 'lodash'
import { Button } from '@/components/UI/Button'
import { useCollectionMutations } from '@/hooks/useCollectionMutations'
import { Sidebar } from '@/components/UI/Sidebar'
import { BreadcrumbTrail, Collection } from '@/types/store'
import { CheckedState } from '@radix-ui/react-checkbox'
import { ProductGrid } from '@/components/UI/ProductGrid'
import PriceRangeSlider from '@/components/UI/PriceRangeSlider'
import FilterChips from '@/components/UI/FilterChips'
import useMakeBreadcrumbItems from '@/hooks/useMakeBreadcrumbItems'

const Page = () => {
    // TODO: add breadcrumb to top of collection page
    const searchParams = useSearchParams()
    const { data, error, isFetching, isSuccess } = useCollection(searchParams)
    const { selectFilterOption, deselectFilterOption, resetFilters, setPriceFilter, fetchMore } =
        useCollectionMutations(searchParams)

    const makeBreadcrumbItems = useMakeBreadcrumbItems()

    const [openRefinements, setOpenRefinements] = useState<string[]>([])

    if (error) {
        console.error(error)
        return <></>
    }

    if (isFetching && !isSuccess) {
        return <>Loading...</>
    }

    const {
        title,
        products,
        totalProductCount,
        hasNextPage,
        filterGroups,
        priceFilter,
        maxPrice,
        relatedCollections,
        department,
    }: Collection = data

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

    // TODO: add sort select on bottom right of CollectionHeader
    return (
        <div className="w-full h-full">
            <CollectionHeader>
                <div className="flex flex-col gap-5 pl-5 py-5">
                    <Breadcrumb className="pl-1">
                        <BreadcrumbList>
                            {makeBreadcrumbItems(trail.collection!, trail)}
                        </BreadcrumbList>
                    </Breadcrumb>
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
                        filterGroups={filterGroups}
                        totalProductCount={totalProductCount}
                        deselectFilter={deselectFilterOption}
                        reset={resetFilters}
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
                                        <div className="flex flex-col gap-3">
                                            {filterGroup.options.map(option => {
                                                const id = groupName + '-' + option.name
                                                return (
                                                    <div className="flex gap-2" key={id}>
                                                        <Checkbox
                                                            id={id}
                                                            checked={option.isSelected}
                                                            onCheckedChange={state =>
                                                                handleFilterOptionToggle(
                                                                    state,
                                                                    groupName,
                                                                    option.name,
                                                                )
                                                            }
                                                        />
                                                        <label className="leading-4" htmlFor={id}>
                                                            {option.name}
                                                        </label>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </Sidebar.MenuContent>
                                </Sidebar.MenuItem>
                            )
                        })}
                        <Sidebar.MenuItem title={'Price'} value={'price'}>
                            <Sidebar.MenuContent>
                                <PriceRangeSlider
                                    setValue={setPriceFilter}
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
                            return (
                                <ProductGrid.Item handle={product.handle} key={product.title}>
                                    <ProductGrid.Image
                                        src={product.featuredImage.src}
                                        alt={product.featuredImage.altText || 'product image'}
                                        width={product.featuredImage.width}
                                        height={product.featuredImage.height}
                                    />
                                    <ProductGrid.Details>
                                        <ProductGrid.Title>{product.title}</ProductGrid.Title>
                                        {product.compareAtPrice ? (
                                            <div>
                                                <span className="text-red line-through">
                                                    ${product.price.amount}
                                                </span>
                                                ${product.compareAtPrice.amount}
                                            </div>
                                        ) : (
                                            <div>${product.price.amount}</div>
                                        )}
                                    </ProductGrid.Details>
                                </ProductGrid.Item>
                            )
                        })}
                    </ProductGrid>
                    <div className="flex flex-col gap-4 items-center py-10">
                        Showing {products.length} of {totalProductCount} products
                        {hasNextPage && !isFetching && (
                            <Button onClick={fetchMore}>Load More</Button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Page
