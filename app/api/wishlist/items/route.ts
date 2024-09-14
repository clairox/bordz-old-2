import {
    addSavedItems,
    getProductVariants,
    removeSavedItems,
} from '@/lib/services/shopify/requestHandlers/admin'
import { handleErrorResponse } from '@/lib/utils/api'
import { DEFAULT_COLLECTION_LIMIT } from '@/lib/utils/constants'
import { NextRequest, NextResponse } from 'next/server'

export const POST = async (request: NextRequest) => {
    const customerAccessToken = request.cookies.get('customerAccessToken')
    if (!customerAccessToken) {
        return NextResponse.json(
            { message: 'Missing customer access token', code: 'UNAUTHORIZED' },
            { status: 401 },
        )
    }

    const { ids, populate, sz, cursor } = await request.json()
    const size = Number(sz) || DEFAULT_COLLECTION_LIMIT

    try {
        const savedItemsIds = await addSavedItems(customerAccessToken.value, ids)

        if (typeof populate !== 'boolean' || populate !== true) {
            return NextResponse.json(savedItemsIds)
        }

        const {
            productVariants: savedItems,
            hasNextPage,
            endCursor,
        } = await getProductVariants(savedItemsIds, size, cursor)
        return NextResponse.json({
            savedItemsIds,
            populatedItems: savedItems,
            hasNextPage,
            endCursor,
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

    const { ids, populate, sz, cursor } = await request.json()
    const size = Number(sz) || DEFAULT_COLLECTION_LIMIT

    try {
        const savedItemsIds = await removeSavedItems(customerAccessToken.value, ids)

        if (typeof populate !== 'boolean' || populate !== true) {
            return NextResponse.json(savedItemsIds)
        }

        const {
            productVariants: savedItems,
            hasNextPage,
            endCursor,
        } = await getProductVariants(savedItemsIds, size, cursor)
        return NextResponse.json({
            savedItemsIds,
            populatedItems: savedItems,
            hasNextPage,
            endCursor,
        })
    } catch (error) {
        return handleErrorResponse(error as Error)
    }
}
