import { GET_VARIANTS } from '@/lib/graphql/shopify/admin/queries'
import { adminAPIClient, checkGraphQLErrors } from '@/lib/services/clients/graphqlClient'
import { extractResourceId } from '@/lib/utils/ids'
import { toSafeVariant } from './validators'

export const getProductVariants = async (ids: string[], limit: number) => {
    const variantQueryString = ids.map(id => 'id:' + extractResourceId(id)).join(' OR ')
    const variables = {
        query: variantQueryString,
        limit,
    }

    try {
        const { data, errors } = await adminAPIClient(GET_VARIANTS, { variables })

        checkGraphQLErrors(errors)

        const items = data?.productVariants.nodes
        if (!Array.isArray(items)) {
            throw new Error('Variants are not of array type')
        }

        const safeVariants = items.map(item => toSafeVariant(item))

        const hasNextPage = data?.productVariants?.pageInfo.hasNextPage
        if (typeof hasNextPage !== 'boolean') {
            throw new Error('hasNextPage is not of boolean type')
        }

        return { productVariants: safeVariants, hasNextPage }
    } catch (error) {
        throw error
    }
}
