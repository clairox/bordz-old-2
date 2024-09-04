import { CustomerAuthData } from '@/types'
import { Customer } from '@/types/store'

export const extractCustomerAuthData = (customer: Customer): CustomerAuthData => {
    const { id, email, firstName, lastName, displayName } = customer
    return { id, email, firstName, lastName, displayName }
}
