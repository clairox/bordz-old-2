import React from 'react'

type HeadingProps = React.PropsWithChildren<React.ComponentPropsWithoutRef<'h1'>>

const Heading: React.FunctionComponent<HeadingProps> = ({ children, ...props }) => {
    return (
        <div {...props} className="flex items-end gap-4 text-4xl font-semibold">
            {children}
        </div>
    )
}

export default Heading
