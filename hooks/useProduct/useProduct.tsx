import { useState, useEffect, useCallback } from 'react'
import type { Product } from '@/types/store'
import { restClient } from '@/lib/services/clients/restClient'

const useProduct = (handle: string) => {
    const [product, setProduct] = useState<Product | undefined>(undefined)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<any | undefined>(undefined)

    const fetchProduct = useCallback(async () => {
        const url = '/products/' + handle

        try {
            const response = await restClient(url)
            setProduct(response.data)
            setLoading(false)
        } catch (error) {
            setError(error)
        }
    }, [handle])

    useEffect(() => {
        if (product == undefined) {
            fetchProduct()
        }
    }, [product, fetchProduct])

    return {
        product,
        loading,
        error,
    }
}

export default useProduct
