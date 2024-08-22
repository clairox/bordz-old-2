import { isNumeric } from '../number'

export const processPriceParam = (price: string | undefined): number[] => {
    const priceRange = price?.split(',')
    if (priceRange == undefined || priceRange.length !== 2) {
        return []
    }

    const [priceMin, priceMax] = priceRange

    if (!isNumeric(priceMin) || !isNumeric(priceMax)) {
        return []
    }

    const min = parseInt(priceMin)
    const max = parseInt(priceMax)

    if (max <= min) {
        return []
    }

    return [min, max]
}
