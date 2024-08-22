import { AvailableFilter } from '@/app/api/collection/types'
import { ensureArray, ensureNumber, ensureString } from './typeGuards'

const ensureAvailableFilterValue = (filterValue: any): { label: string; count: number } => ({
    label: ensureString(filterValue.label),
    count: ensureNumber(filterValue.count),
})

export const validateFilter = (filter: any): AvailableFilter => {
    const error = new Error('Safe filter conversion failed')
    if (!filter) {
        console.error(error)
        throw error
    }

    try {
        const safeAvailableFilter = {
            label: ensureString(filter.label),
            values: ensureArray(filter.values, ensureAvailableFilterValue),
        }

        return safeAvailableFilter
    } catch {
        console.error(error)
        throw error
    }
}
