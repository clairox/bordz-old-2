'use client'
import { useAccount } from '@/context/AccountContext/AccountContext'
import { useLogoutMutation } from '@/hooks'
import { HeartStraight, House, Lock, Package, SignOut, Gear, User } from '@phosphor-icons/react'
import Link from 'next/link'
import React from 'react'

const AccountSidebar = () => {
    const { data: customer } = useAccount()
    const { mutate: logout } = useLogoutMutation()

    const handleLogout = async () => {
        const options = {
            onSuccess: () => (window.location.href = '/'),
            onError: (error: Error) => console.error(error),
        }

        logout(undefined as void, options)
    }

    return (
        <div className="col-span-4 flex flex-col">
            <div className="flex items-center px-5 h-24 border border-t-0 border-black text-3xl font-bold tracking-wider">
                <h1>
                    Hey,
                    <br />
                    {customer?.firstName}!
                </h1>
            </div>
            <Link
                className="flex items-center gap-3 px-5 h-16 border border-t-0 border-black hover:bg-gray-100"
                href="/account/settings"
            >
                <Gear size={28} weight="light" />
                Settings
            </Link>
            <Link
                className="flex items-center gap-3 px-5 h-16 border border-t-0 border-black hover:bg-gray-100"
                href="/account/orders"
            >
                <Package size={28} weight="light" />
                Orders
            </Link>
            <Link
                className="flex items-center gap-3 px-5 h-16 border border-t-0 border-black hover:bg-gray-100"
                href="/account/personal-details"
            >
                <User size={28} weight="light" />
                Personal Details
            </Link>
            <Link
                className="flex items-center gap-3 px-5 h-16 border border-t-0 border-black hover:bg-gray-100"
                href="/saved"
            >
                <HeartStraight size={28} weight="light" />
                Saved Items
            </Link>
            <Link
                className="flex items-center gap-3 px-5 h-16 border border-t-0 border-black hover:bg-gray-100"
                href="/account/addresses"
            >
                <House size={28} weight="light" />
                Shipping Addresses
            </Link>
            <Link
                className="flex items-center gap-3 px-5 h-16 border border-t-0 border-black hover:bg-gray-100"
                href="/account/change-password"
            >
                <Lock size={28} weight="light" />
                Change Password
            </Link>
            <button
                className="flex items-center gap-3 px-5 h-16 border border-t-0 border-black hover:bg-gray-100"
                onClick={handleLogout}
            >
                <SignOut size={28} weight="light" />
                Logout
            </button>
        </div>
    )
}

export default AccountSidebar
