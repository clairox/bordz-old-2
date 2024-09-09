import {
    addCartLines,
    removeCartLines,
    updateCartLines,
} from '@/lib/services/shopify/requestHandlers/storefront'
import { handleErrorResponse } from '@/lib/utils/api'
import { NextRequest, NextResponse } from 'next/server'

export const POST = async (request: NextRequest, context: { params: { id: string } }) => {
    const { id } = context.params
    const { lines } = await request.json()

    try {
        const cart = await addCartLines(id, lines)
        return NextResponse.json(cart)
    } catch (error) {
        return handleErrorResponse(error as Error)
    }
}

export const PATCH = async (request: NextRequest, context: { params: { id: string } }) => {
    const { id } = context.params
    const { lines } = await request.json()

    try {
        const cart = await updateCartLines(id, lines)

        return NextResponse.json(cart)
    } catch (error) {
        return handleErrorResponse(error as Error)
    }
}

export const DELETE = async (request: NextRequest, context: { params: { id: string } }) => {
    const { id } = context.params
    const { lineIds } = await request.json()

    try {
        const cart = await removeCartLines(id, lineIds)

        return NextResponse.json(cart)
    } catch (error) {
        return handleErrorResponse(error as Error)
    }
}
