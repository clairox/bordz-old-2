import { useAuth } from '@/context/AuthContext/AuthContext'
import { getLocalWishlist, getWishlist } from '@/lib/core/wishlists'
import { WishlistItem } from '@/types/store'
import { useCallback, useEffect, useReducer } from 'react'
import { custom } from 'zod'

type UseWishlistState = {
    data:
        | { wishlist: string[]; populatedWishlist: WishlistItem[]; hasNextPage: boolean }
        | undefined
    loading: boolean
    error: any | undefined
}

type UseWishlistAction =
    | { type: 'FETCH_START' }
    | {
          type: 'FETCH_SUCCESS'
          payload: {
              wishlist: string[]
              populatedWishlist: WishlistItem[]
              hasNextPage: boolean
          }
      }
    | { type: 'FETCH_FAILURE'; payload: Error }

const reducer = (state: UseWishlistState, action: UseWishlistAction) => {
    switch (action.type) {
        case 'FETCH_START':
            return {
                ...state,
                loading: true,
            }
        case 'FETCH_SUCCESS':
            return {
                data: action.payload,
                loading: false,
                error: undefined,
            }
        case 'FETCH_FAILURE':
            return {
                data: undefined,
                loading: false,
                error: action.payload,
            }
        default:
            throw new Error(`Unhandled action type: ${action}`)
    }
}

const initialState = {
    data: undefined,
    loading: true,
    error: undefined,
}

const useWishlist = (limit: number) => {
    const [state, dispatch] = useReducer(reducer, initialState)
    const { customerId } = useAuth()

    const fetchWishlist = useCallback(async () => {
        dispatch({ type: 'FETCH_START' })

        try {
            // TODO: use consistent naming scheme for wishlist ids and populated wishlist
            const data = await (customerId ? getWishlist(limit) : getLocalWishlist(limit))

            dispatch({ type: 'FETCH_SUCCESS', payload: data })
        } catch (error) {
            dispatch({ type: 'FETCH_FAILURE', payload: error as Error })
        }
    }, [limit, customerId])

    useEffect(() => {
        if (state.data == undefined) {
            fetchWishlist()
        }
    }, [state.data, fetchWishlist])

    return {
        ...state,
        dispatch,
    }
}

export default useWishlist
