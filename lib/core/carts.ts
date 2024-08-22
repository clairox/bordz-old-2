import { Cart } from '@/types/store'
import { restClient } from '../clients/restClient'

const getCart = async (id: string): Promise<Cart> => {
    try {
        const response = await restClient('/cart/' + id)
        return response.data
    } catch (error) {
        throw error
    }
}

const createCart = async (): Promise<Cart> => {
    try {
        const response = await restClient('/cart', {
            method: 'POST',
        })
        return response.data
    } catch (error) {
        throw error
    }
}

export { getCart, createCart }
