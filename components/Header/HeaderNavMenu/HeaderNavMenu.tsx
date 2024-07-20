'use client'
import React, { useEffect, useState } from 'react'
import { NavigationMenu, NavigationMenuList } from '@/components/ui/NavigationMenu'
import NavMenuItem, { Subcategories } from '@/components/Header/HeaderNavMenuItem'
import navMenuData from './navMenuData.json'

const HeaderNavMenu = () => {
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

export default HeaderNavMenu
