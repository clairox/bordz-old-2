'use client'
import React, { useState } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/UI/Popover'
import MiniLoginForm from '@/components/Forms/MiniLoginForm'
import { User } from '@phosphor-icons/react'
import Link from 'next/link'
import NavAction from '@/components/NavAction'

const AccountNavAction: React.FunctionComponent<{
    isAuthenticated: boolean
}> = ({ isAuthenticated }) => {
    const [open, setOpen] = useState(false)

    const close = () => setOpen(false)

    if (isAuthenticated) {
        return (
            <Link href="/account/settings">
                <NavAction triggered={open} data-testid={'accountActionButton'}>
                    <User size={28} weight={open ? 'fill' : 'light'} />
                </NavAction>
            </Link>
        )
    }

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <NavAction triggered={open} data-testid={'accountActionButton'}>
                    <User size={28} weight={open ? 'fill' : 'light'} />
                </NavAction>
            </PopoverTrigger>
            <PopoverContent alignOffset={-80} className="p-0 pt-4 w-[300px] border-t-0">
                <MiniLoginForm closePopover={close} />
            </PopoverContent>
        </Popover>
    )
}

export default AccountNavAction
