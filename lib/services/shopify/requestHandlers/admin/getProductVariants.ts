import { GET_VARIANTS } from '@/lib/graphql/shopify/admin/queries'
import { extractResourceId } from '@/lib/utils/ids'
import { adminClient } from './base'
import { validateProductVariantItem } from '@/lib/services/shopify/validators'

export const getProductVariants = async (ids: string[], size: number, cursor: string) => {
    if (ids.length === 0) {
        return { productVariants: [], hasNextPage: false }
    }

    const variantQueryString = ids.map(id => 'id:' + extractResourceId(id)).join(' OR ')
    const config = {
        variables: {
            query: variantQueryString,
            first: size,
            after: cursor,
        },
    }

    try {
        const { productVariants } = await adminClient(GET_VARIANTS, 'productVariants', config)

        const items = productVariants.nodes
        if (!Array.isArray(items)) {
            throw new Error('Variants are not of array type')
        }

        const safeVariants = items.map(item => validateProductVariantItem(item))

        const hasNextPage = productVariants.pageInfo.hasNextPage
        if (typeof hasNextPage !== 'boolean') {
            throw new Error('hasNextPage is not of boolean type')
        }

        const endCursor = productVariants.pageInfo.endCursor

        return { productVariants: safeVariants, hasNextPage, endCursor }
    } catch (error) {
        throw error
    }
}
