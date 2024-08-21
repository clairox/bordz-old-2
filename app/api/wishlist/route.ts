import { NextRequest, NextResponse } from 'next/server'
import { getWishlist, populateWishlist } from './common/requestHandlers'
import { isNumeric } from '@/lib/utils/number'
import { handleErrorResponse } from '@/lib/utils/api'

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
    const start = searchParams.get('start')

    try {
        const wishlistItemIds = await getWishlist(customerAccessToken.value)

        if (populate !== 'true') {
            return NextResponse.json({ wishlist: wishlistItemIds, hasNextPage: false })
        }

        const limit = 40 + (start && isNumeric(start) ? Number(start) : 0)
        const { wishlistItems, hasNextPage } = await populateWishlist(wishlistItemIds, limit)
        return NextResponse.json({
            wishlist: wishlistItemIds,
            populatedWishlist: wishlistItems,
            hasNextPage,
        })
    } catch (error) {
        return handleErrorResponse(error as Error)
    }
}
