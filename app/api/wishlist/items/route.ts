import { handleErrorResponse } from '@/lib/utils/api'
import { isNumeric } from '@/lib/utils/number'
import { NextRequest, NextResponse } from 'next/server'
import { addWishlistItems, populateWishlist, removeWishlistItems } from './common/requestHandlers'

export const POST = async (request: NextRequest) => {
    const customerAccessToken = request.cookies.get('customerAccessToken')
    if (!customerAccessToken) {
        return NextResponse.json(
            { message: 'Missing customer access token', code: 'UNAUTHORIZED' },
            { status: 401 },
        )
    }

    const { ids, populate, start } = await request.json()

    try {
        const wishlistItemIds = await addWishlistItems(customerAccessToken.value, ids)

        if (typeof populate !== 'boolean' || populate !== true) {
            return NextResponse.json(wishlistItemIds)
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

export const DELETE = async (request: NextRequest) => {
    const customerAccessToken = request.cookies.get('customerAccessToken')
    if (!customerAccessToken) {
        return NextResponse.json(
            { message: 'Missing customer access token', code: 'UNAUTHORIZED' },
            { status: 401 },
        )
    }

    const { ids, populate, start } = await request.json()

    try {
        const wishlistItemIds = await removeWishlistItems(customerAccessToken.value, ids)

        if (typeof populate !== 'boolean' || populate !== true) {
            return NextResponse.json(wishlistItemIds)
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
