import Link, { LinkProps } from 'next/link'
import React, { PropsWithChildren, ComponentPropsWithoutRef } from 'react'

const Section = function ({ children }: PropsWithChildren) {
    return <div className="px-8 py-5 w-full border-r border-b border-black">{children}</div>
}

const SectionHeading = function ({
    children,
    ...props
}: PropsWithChildren<ComponentPropsWithoutRef<'h2'>>) {
    return (
        <h2 {...props} className="relative w-full h-6 mb-6 font-semibold text-lg">
            {children}
        </h2>
    )
}

const SectionActionLink = function ({ children, ...props }: PropsWithChildren<LinkProps>) {
    return (
        <Link {...props} className="absolute right-0 top-0 font-normal text-base">
            {children}
        </Link>
    )
}

const SectionContent = function ({ children }: PropsWithChildren) {
    return <div>{children}</div>
}

SectionHeading.ActionLink = SectionActionLink

Section.Heading = SectionHeading
Section.Content = SectionContent

export { Section }
