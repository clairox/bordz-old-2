import { AccordionItemProps, AccordionMultipleProps } from '@radix-ui/react-accordion'
import React, { PropsWithChildren } from 'react'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../Accordion'
import { ScrollArea } from '../ScrollArea'

function Sidebar({ children }: PropsWithChildren) {
    return <div className="border-r border-black h-full">{children}</div>
}

function SidebarMenu({ children }: Omit<AccordionMultipleProps, 'type'>) {
    return <Accordion type="multiple">{children}</Accordion>
}

function SidebarMenuItem({ children, title, ...props }: AccordionItemProps) {
    return (
        <AccordionItem className="border-b border-gray-300" {...props}>
            <AccordionTrigger className="px-4 text-base text-gray-600 hover:text-black">
                {title}
            </AccordionTrigger>
            {children}
        </AccordionItem>
    )
}

function SidebarMenuContent({ children }: PropsWithChildren) {
    return (
        <AccordionContent className="pl-4 pr-2 py-4 border-t border-gray-200">
            <ScrollArea className="h-64">
                <div className="">{children}</div>
            </ScrollArea>
        </AccordionContent>
    )
}

Sidebar.Menu = SidebarMenu
Sidebar.MenuItem = SidebarMenuItem
Sidebar.MenuContent = SidebarMenuContent
export { Sidebar }
