'use client'
import React, { useState, useEffect } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/UI/Popover'
import { BagSimple } from '@phosphor-icons/react'
import MiniCart from '@/components/MiniCart'
import eventEmitter from '@/lib/utils/eventEmitter'
import NavAction from '@/components/NavAction'

const CartNavAction = () => {
    const [open, setOpen] = useState(false)

    const close = () => setOpen(false)

    useEffect(() => {
        eventEmitter.on('linkClick', close)

        return () => {
            eventEmitter.off('linkClick', close)
        }
    }, [])

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <NavAction triggered={open}>
                    <BagSimple size={28} weight={open ? 'fill' : 'light'} />
                </NavAction>
            </PopoverTrigger>
            <PopoverContent className="p-0 w-[450px] border-t-0 border-r-0">
                <MiniCart />
            </PopoverContent>
        </Popover>
    )
}

export default CartNavAction
