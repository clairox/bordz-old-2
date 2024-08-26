import { RestClientError } from '@/lib/clients/restClient'
import { Customer } from '@/types/store'
import { useReducer } from 'react'

type AccountState = {
    customer: Customer | undefined
    error: RestClientError | undefined
    loading: boolean
}

type AccountAction =
    | { type: 'FETCH_START' }
    | { type: 'FETCH_SUCCESS'; payload: Customer }
    | { type: 'FETCH_FAILURE'; payload: RestClientError }

const reducer = (state: AccountState, action: AccountAction) => {
    switch (action.type) {
        case 'FETCH_START':
            return {
                ...state,
                loading: true,
            }
        case 'FETCH_SUCCESS':
            return {
                customer: action.payload,
                error: undefined,
                loading: false,
            }
        case 'FETCH_FAILURE':
            return {
                customer: undefined,
                error: action.payload,
                loading: false,
            }
    }
}

const initialState = {
    customer: undefined,
    error: undefined,
    loading: true,
}

const useAccount = () => {
    const [state, dispatch] = useReducer(reducer, initialState)
}
