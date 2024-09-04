'use client'
import React, { useState, useEffect } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/UI/Popover'
import HeaderButton from '@/components/Header/HeaderAction'
import { BagSimple } from '@phosphor-icons/react/dist/ssr'
import MiniCart from '@/components/MiniCart'
import eventEmitter from '@/lib/utils/eventEmitter'

const CartAction = () => {
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
                <HeaderButton triggered={open}>
                    <BagSimple size={28} weight={open ? 'fill' : 'light'} />
                </HeaderButton>
            </PopoverTrigger>
            <PopoverContent className="p-0 w-[450px] border-t-0 border-r-0">
                <MiniCart />
            </PopoverContent>
        </Popover>
    )
}

export default CartAction
