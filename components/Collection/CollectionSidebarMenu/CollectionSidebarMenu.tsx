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

const CollectionSidebarMenuItemContent: React.FunctionComponent<{
    filterKey: string
    values: string[] | undefined
    selectedValues: string[] | undefined
    handleFilterToggle: (
        key: string,
        value: string,
        event: React.ChangeEvent<HTMLInputElement>,
    ) => void
}> = ({ filterKey, values, selectedValues, handleFilterToggle }) => {
    if (values == undefined || values.length === 0) {
        return <></>
    }

    if (handleFilterToggle == undefined) {
        return <></>
    }

    // TODO: use shad/cn Checkbox
    return (
        <ul className="list-none">
            {values.toSorted().map(value => {
                const isSelected = selectedValues?.includes(value) || false
                return (
                    <li key={value} className="pl-6 py-1 hover:underline cursor-pointer">
                        <label htmlFor={value + 'checkbox'}>
                            <input
                                id={value + 'checkbox'}
                                type={'checkbox'}
                                checked={isSelected}
                                onChange={event => handleFilterToggle(filterKey, value, event)}
                            />
                            <span className={'pl-2'}>{value}</span>
                        </label>
                    </li>
                )
            })}
        </ul>
    )
}

export { CollectionSidebarMenu, CollectionSidebarMenuItem, CollectionSidebarMenuItemContent }
