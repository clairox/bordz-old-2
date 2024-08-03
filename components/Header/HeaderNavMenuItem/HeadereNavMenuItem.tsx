'use client'
import Link from 'next/link'
import React from 'react'
import {
	NavigationMenuContent,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuTrigger,
	navigationMenuTriggerStyle,
} from '@/components/UI/NavigationMenu'

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

const HeaderNavMenuItem: React.FunctionComponent<{
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
									<NavMenuLink key={link.title} title={link.title} href={link.href} />
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
				<Link href={'/shop/' + href}>{title}</Link>
			</NavigationMenuLink>
		</li>
	)
}

export default HeaderNavMenuItem
export type { Subcategories }
