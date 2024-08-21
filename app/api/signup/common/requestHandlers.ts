import { CREATE_CUSTOMER_METAFIELDS } from '@/lib/graphql/shopify/admin/mutations'
import {
    adminAPIClient,
    checkGraphQLErrors,
    checkUserErrors,
    storefrontAPIClient,
} from '@/lib/services/clients/graphqlClient'
import {
    CREATE_ACCESS_TOKEN,
    CREATE_CART,
    CREATE_CUSTOMER,
} from '@/lib/graphql/shopify/storefront/mutations'
import { Wishlist } from '@/types/store'
import { toSafeCustomer } from './validators'
import { GET_CUSTOMER } from '@/lib/graphql/shopify/storefront/queries'

export const createCart = async () => {
    try {
        const { data, errors } = await storefrontAPIClient(CREATE_CART)

        checkGraphQLErrors(errors)
        checkUserErrors(data?.cartCreate?.userErrors)

        const id = data?.cartCreate?.cart?.id
        if (typeof id !== 'string') {
            throw new Error('An error occurred while creating cart')
        }

        return { id }
    } catch (error) {
        throw error
    }
}

const createCustomerMetafields = async (
    customerId: string,
    birthDate: Date,
    cartId: string,
    wishlist: Wishlist,
) => {
    const variables = {
        id: customerId,
        birthDate: birthDate.toISOString(),
        wishlist: JSON.stringify(wishlist),
        cartId,
    }

    try {
        const { data, errors } = await adminAPIClient(CREATE_CUSTOMER_METAFIELDS, { variables })

        checkGraphQLErrors(errors)
        checkUserErrors(data?.customerUpdate?.userErrors)

        const id = data?.customerUpdate?.customer?.id
        if (typeof id !== 'string') {
            throw new Error('An error occurred while creating customer metafields')
        }

        return id
    } catch (error) {
        throw error
    }
}

const createAccessToken = async (email: string, password: string) => {
    const variables = { email, password }

    try {
        const { data, errors } = await storefrontAPIClient(CREATE_ACCESS_TOKEN, { variables })

        checkGraphQLErrors(errors)
        checkUserErrors(data?.customerAccessTokenCreate?.customerUserErrors)

        const customerAccessToken = data?.customerAccessTokenCreate?.customerAccessToken
        if (customerAccessToken == undefined) {
            throw new Error('An error occurred while creating access token')
        }

        return customerAccessToken
    } catch (error) {
        throw error
    }
}

const getCustomer = async (customerAccessToken: string) => {
    const variables = {
        customerAccessToken,
    }

    try {
        const { data, errors } = await storefrontAPIClient(GET_CUSTOMER, { variables })

        checkGraphQLErrors(errors)

        const customer = data?.customer
        const safeCustomer = toSafeCustomer(customer)

        return safeCustomer
    } catch (error) {
        throw error
    }
}

export const createCustomer = async (
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    birthDate: Date,
    cartId: string,
    wishlist: Wishlist,
    phone?: string,
) => {
    const variables = {
        email,
        password,
        firstName,
        lastName,
        phone,
    }

    try {
        const { data, errors } = await storefrontAPIClient(CREATE_CUSTOMER, { variables })

        checkGraphQLErrors(errors)
        checkUserErrors(data?.customerCreate?.customerUserErrors, { TAKEN: 409 })

        const id = data?.customerCreate?.customer?.id
        if (typeof id !== 'string') {
            throw new Error('An error occurred during signup')
        }

        await createCustomerMetafields(id, birthDate, cartId, wishlist)
        const customerAccessToken = await createAccessToken(email, password)
        const customer = await getCustomer(customerAccessToken.accessToken)

        return { customer, customerAccessToken }
    } catch (error) {
        throw error
    }
}
