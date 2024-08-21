'use client'
import { Button } from '@/components/UI/Button'
import Wishlist from '@/components/Wishlist/Wishlist'
import useWishlist from '@/hooks/useWishlist/useWishlist'
import { getWishlist } from '@/lib/services/core/wishlists'

const Page = () => {
    const limit = 40
    const { data, dispatch, loading, error } = useWishlist(limit)

    if (error) {
        // TODO: handle error
        console.error(error)
        return <></>
    }

    if (loading) {
        return <div>Loading...</div>
    }

    if (data == undefined) {
        // TODO: 500
        return <></>
    }

    const handleLoadMoreButtonClick = async () => {
        dispatch({ type: 'FETCH_START' })
        try {
            const newData = await getWishlist(data.wishlist.length + limit)

            dispatch({ type: 'FETCH_SUCCESS', payload: newData })
        } catch (error) {
            // TODO: handle error
        }
    }

    return (
        <div>
            <h1>Wishlist</h1>
            <Wishlist wishlist={data.populatedWishlist} dispatch={dispatch} limit={limit} />
            {data.hasNextPage && <Button onClick={handleLoadMoreButtonClick}>Load More</Button>}
        </div>
    )
}

export default Page
