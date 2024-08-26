'use client'
import AccountSidebar from '@/components/Account/AccountSidebar'
import React from 'react'
import { AccountProvider } from '@/context/AccountContext/AccountContext'
import { useAuth } from '@/context/AuthContext/AuthContext'

const Layout = ({ children }: React.PropsWithChildren) => {
    const { customerId, error, loading } = useAuth()

    if (error) {
        console.error(error)
        return <></>
    }

    if (loading) {
        return <>Loading...</>
    }

    return (
        <AccountProvider customerId={customerId as string}>
            <div className="grid grid-cols-12 w-[950px]">
                <aside className="col-span-3">
                    <AccountSidebar />
                </aside>
                <main className="col-span-9 w-full">{children}</main>
            </div>
        </AccountProvider>
    )
}

export default Layout
