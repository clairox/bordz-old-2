import { CollectionFilterArray } from '@/types/store'

export const makeProductFilters = (
    filterGroups: Record<string, string[]>,
    priceFilter?: number[],
): CollectionFilterArray => {
    const baseFilterArray: CollectionFilterArray = [{ available: true }]

    if (priceFilter && isValidPriceRange(priceFilter)) {
        const [min, max] = priceFilter
        baseFilterArray.push({ price: { min, max } })
    }

    return [
        ...baseFilterArray,
        ...constructBrandFilters(filterGroups.brand),
        ...constructSizeFilters(filterGroups.size),
        ...constructColorFilters(filterGroups.color),
    ]
}

const isValidPriceRange = (priceRange: number[]): boolean =>
    priceRange[0] < priceRange[1] && priceRange.length === 2

const constructBrandFilters = (brands?: string[]): CollectionFilterArray => {
    return brands?.map(brand => ({ productVendor: brand })) || []
}

const constructSizeFilters = (sizes?: string[]): CollectionFilterArray => {
    return sizes?.map(size => ({ variantOption: { name: 'size', value: size } })) || []
}

const constructColorFilters = (colors?: string[]): CollectionFilterArray => {
    return (
        colors?.map(color => ({
            productMetafield: { key: 'color', namespace: 'custom', value: color },
        })) || []
    )
}
