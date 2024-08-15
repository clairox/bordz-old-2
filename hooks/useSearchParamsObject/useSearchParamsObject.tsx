import { searchParamsToObject } from '@/lib/utils/conversions'
import { useSearchParams } from 'next/navigation'
import React from 'react'

const useSearchParamsObject = () => {
	const searchParams = useSearchParams()
	return searchParamsToObject(searchParams)
}

export default useSearchParamsObject
