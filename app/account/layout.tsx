'use client'
import AccountSidebar from '@/components/AccountSidebar'
import React from 'react'
import { AccountProvider } from '@/context/AccountContext/AccountContext'
import { useAuth } from '@/context/AuthContext/AuthContext'
import Redirect from '@/components/Redirect'

const Layout = ({ children }: React.PropsWithChildren) => {
    const { data, error, isPending } = useAuth()

    if (error) {
        console.error(error)
        return <></>
    }

    if (isPending) {
        return <>Loading...</>
    }

    if (data == undefined) {
        return <Redirect href={'/login'} replace={true} />
    }

    return (
        <AccountProvider customerId={data.id}>
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
