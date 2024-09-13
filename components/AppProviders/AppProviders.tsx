'use client'

import { AuthProvider } from '@/context/AuthContext/AuthContext'
import { getQueryClient } from '@/lib/clients/queryClient'
import { QueryClientProvider } from '@tanstack/react-query'
import { FunctionComponent, PropsWithChildren } from 'react'

const AppProviders: FunctionComponent<PropsWithChildren> = ({ children }) => {
    const queryClient = getQueryClient()

    return (
        <QueryClientProvider client={queryClient}>
            <AuthProvider>{children}</AuthProvider>
        </QueryClientProvider>
    )
}

export default AppProviders
