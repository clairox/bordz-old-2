'use client'
import React, { useEffect, useState } from 'react'
import { NavigationMenu, NavigationMenuList } from '@/components/UI/NavigationMenu'
import navMenuData from './navMenuData.json'
import Link from 'next/link'
import {
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuTrigger,
    navigationMenuTriggerStyle,
} from '@/components/UI/NavigationMenu'

const NavMenu = () => {
    const [annoyingDiv, setAnnoyingDiv] = useState<Element | null>(null)

    // Shadcn/UI's NavigationMenuList is wrapped in a component which is not easy to access
    // and does not have the correct height so it's easier to just fix that here
    useEffect(() => {
        if (annoyingDiv === null) {
            const div = document.querySelector('.nav-menu')?.firstElementChild
            if (!div) return
            div.className += ' h-full'
            setAnnoyingDiv(div)
        }
    }, [annoyingDiv])

    return (
        <NavigationMenu className="nav-menu h-full">
            <NavigationMenuList asChild>
                <div className="flex justify-center items-center space-x-0 h-full">
                    <NavMenuItem
                        title={navMenuData.skate.title}
                        subcategories={navMenuData.skate.subcategories as Subcategories}
                    />
                    <NavMenuItem
                        title={navMenuData.snow.title}
                        subcategories={navMenuData.snow.subcategories as Subcategories}
                    />
                </div>
            </NavigationMenuList>
        </NavigationMenu>
    )
}

type NavMenuLink = {
    title: string
    href: string
}

type Subcategory = {
    title: 'string'
    links: NavMenuLink[]
}

type Subcategories = {
    [key: string]: Subcategory
}

const NavMenuItem: React.FunctionComponent<{
    title: string
    subcategories: Subcategories
}> = ({ title, subcategories }) => {
    return (
        <NavigationMenuItem className="h-full border-l border-black">
            <NavigationMenuTrigger className="h-full text-lg tracking-wide w-24">
                {title}
            </NavigationMenuTrigger>
            <NavigationMenuContent>
                {Object.keys(subcategories).map(subcategoryName => {
                    const subcategory = subcategories[subcategoryName]
                    return (
                        <div key={subcategoryName}>
                            <h1>{subcategory.title}</h1>
                            <ul>
                                {subcategory.links.map(link => (
                                    <NavMenuLink
                                        key={link.title}
                                        title={link.title}
                                        href={link.href}
                                    />
                                ))}
                            </ul>
                        </div>
                    )
                })}
            </NavigationMenuContent>
        </NavigationMenuItem>
    )
}

const NavMenuLink: React.FunctionComponent<{ title: string; href: string }> = ({ title, href }) => {
    return (
        <li>
            <NavigationMenuLink className={navigationMenuTriggerStyle()} asChild>
                <Link href={href}>{title}</Link>
            </NavigationMenuLink>
        </li>
    )
}

export default NavMenu
