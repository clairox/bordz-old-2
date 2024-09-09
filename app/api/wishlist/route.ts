import { NextRequest, NextResponse } from 'next/server'
import { handleErrorResponse } from '@/lib/utils/api'
import { getWishlist } from '@/lib/services/shopify/requestHandlers/storefront'
import { getProductVariants } from '@/lib/services/shopify/requestHandlers/admin'
import { DEFAULT_COLLECTION_LIMIT } from '@/lib/utils/constants'

export const GET = async (request: NextRequest) => {
    const customerAccessToken = request.cookies.get('customerAccessToken')
    if (!customerAccessToken) {
        return NextResponse.json(
            { message: 'Missing customer access token', code: 'UNAUTHORIZED' },
            { status: 401 },
        )
    }

    const searchParams = request.nextUrl.searchParams
    const populate = searchParams.get('populate')
    const size = Number(searchParams.get('sz')) || DEFAULT_COLLECTION_LIMIT
    const cursor = searchParams.get('cursor') as string

    try {
        const wishlistItemIds = await getWishlist(customerAccessToken.value)

        if (populate !== 'true') {
            return NextResponse.json({ wishlist: wishlistItemIds, hasNextPage: false })
        }

        console.log(size, cursor)

        const {
            productVariants: wishlistItems,
            hasNextPage,
            endCursor,
        } = await getProductVariants(wishlistItemIds, size, cursor)

        return NextResponse.json({
            wishlist: wishlistItemIds,
            populatedWishlist: wishlistItems,
            hasNextPage,
            endCursor,
        })
    } catch (error) {
        return handleErrorResponse(error as Error)
    }
}
