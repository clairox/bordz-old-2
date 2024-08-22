'use client'
import { restClient } from '@/lib/clients/restClient'
import { ProductListItem } from '@/types/store'
import { useParams } from 'next/navigation'
import { useRef, useEffect, useCallback, useState } from 'react'
import _ from 'lodash'
import { searchParamsToObject } from '@/lib/utils/conversions'

const useCollection = (searchParams: URLSearchParams) => {
    const [title, setTitle] = useState('')
    const [subcategoryTitles, setSubcategoryTitles] = useState<string[]>([])
    const [products, setProducts] = useState<ProductListItem[] | undefined>(undefined)
    const [hasNextPage, setHasNextPage] = useState(false)
    const [maxPrice, setMaxPrice] = useState(Infinity)
    const [productCount, setProductCount] = useState(NaN)
    const [loading, setLoading] = useState(true)

    const params = useParams()
    const currentSearchParams = useRef<Record<string, string>>({})

    const loadCollection = useCallback(() => {
        setLoading(true)
        const [handle, subcategory] = params.collection as string[]

        let url = `/collection?handle=${handle}`
        if (subcategory) {
            url += `&subcategory=${subcategory}`
        }
        Object.keys(currentSearchParams.current).forEach(
            key => (url += `&${key}=${currentSearchParams.current[key]}`),
        )

        restClient(url)
            .then(response => {
                setTitle(response.data.title)
                setSubcategoryTitles(response.data.subcategoryTitles)
                setProducts(response.data.products)
                setHasNextPage(response.data.hasNextPage)
                setMaxPrice(response.data.maxPrice)
                setProductCount(response.data.productCount)
                setLoading(false)
            })
            .catch(error => {
                console.error(error)
                // TODO: 500 page
            })
    }, [params.collection])

    useEffect(() => {
        if (!_.isEqual(searchParams, currentSearchParams.current)) {
            currentSearchParams.current = searchParamsToObject(searchParams)
            loadCollection()
        }
    }, [params, searchParams, loadCollection, currentSearchParams])

    return {
        title,
        subcategoryTitles,
        products,
        productCount,
        maxPrice,
        hasNextPage,
        loading,
    }
}

export { useCollection }
