import { CollectionFilterArray, CollectionFilterValues } from '@/types/store'

export const makeProductFilters = (filterValues: CollectionFilterValues): CollectionFilterArray => {
    const baseFilterArray: CollectionFilterArray = [{ available: true }]

    if (filterValues.subcategory) {
        baseFilterArray.push({
            productMetafield: {
                namespace: 'custom',
                key: 'subcategory',
                value: filterValues.subcategory,
            },
        })
    }

    if (filterValues.price && isValidPriceRange(filterValues.price)) {
        const [min, max] = filterValues.price
        baseFilterArray.push({ price: { min, max } })
    }

    return [
        ...baseFilterArray,
        ...constructBrandFilters(filterValues.brands),
        ...constructSizeFilters(filterValues.sizes),
        ...constructColorFilters(filterValues.colors),
    ]
}

const isValidPriceRange = (priceRange: number[]): boolean =>
    priceRange[0] < priceRange[1] && priceRange.length === 2

const constructBrandFilters = (brands: string[]): CollectionFilterArray => {
    return brands.map(brand => ({ productVendor: brand }))
}

const constructSizeFilters = (sizes: string[]): CollectionFilterArray => {
    return sizes.map(size => ({ variantOption: { name: 'size', value: size } }))
}

const constructColorFilters = (colors: string[]): CollectionFilterArray => {
    return colors.map(color => ({
        productMetafield: { key: 'color', namespace: 'custom', value: color },
    }))
}
