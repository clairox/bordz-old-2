import React from 'react'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/Accordion'

const RefinementsRoot: React.FunctionComponent<{ children: React.ReactNode }> = ({ children }) => {
	return <Accordion type="multiple">{children}</Accordion>
}

const RefinementsItem: React.FunctionComponent<{
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

export { RefinementsRoot, RefinementsItem }
