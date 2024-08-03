'use client'
import React from 'react'
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from '@/components/UI/Accordion'

const CollectionSidebarMenu: React.FunctionComponent<{
	openRefinements: string[]
	setOpenRefinements: (refinements: string[]) => void
	children: React.ReactNode
}> = ({ openRefinements, setOpenRefinements, children }) => {
	return (
		<Accordion
			type="multiple"
			value={openRefinements}
			onValueChange={newValue => setOpenRefinements(newValue)}
		>
			{children}
		</Accordion>
	)
}

const CollectionSidebarMenuItem: React.FunctionComponent<{
	title: string
	children?: React.ReactNode
}> = ({ title, children }) => {
	return (
		<AccordionItem className="border-b border-black" value={title}>
			<AccordionTrigger className="px-5 py-4 text-base font-normal">{title}</AccordionTrigger>
			<AccordionContent className="py-3 border-t border-gray-300 text-sm">
				{children}
			</AccordionContent>
		</AccordionItem>
	)
}

export { CollectionSidebarMenu, CollectionSidebarMenuItem }
