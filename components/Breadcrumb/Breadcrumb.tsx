import { BreadcrumbTrail, BreadcrumbTrailItem } from '@/types/store'
import { Fragment } from 'react'
import {
    Breadcrumb as BreadcrumbRoot,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbSeparator,
} from '../UI/Breadcrumb'

type BreadcrumbProps = {
    endNode: BreadcrumbTrailItem
    trail: BreadcrumbTrail
}

const Breadcrumb: React.FunctionComponent<BreadcrumbProps> = ({ endNode, trail }) => {
    const renderBreadcrumbItem = (node: BreadcrumbTrailItem) => (
        <Fragment key={node.title}>
            {node.parent && <BreadcrumbSeparator className="text-sm">/</BreadcrumbSeparator>}
            <BreadcrumbItem className="text-sm">
                {node.href ? (
                    <BreadcrumbLink href={node.href}>{node.title}</BreadcrumbLink>
                ) : (
                    <span className="text-gray-700">{node.title}</span>
                )}
            </BreadcrumbItem>
        </Fragment>
    )

    // NOTE: Breadcrumb is built recursively by traversing up the parent of each node.
    const makeBreadcrumbItems = (
        node: BreadcrumbTrailItem,
        trail: BreadcrumbTrail,
    ): JSX.Element[] => {
        if (node == undefined) {
            throw new Error('Invalid breadcrumb trail')
        }

        const breadcrumbItems = [renderBreadcrumbItem(node)]

        if (node.parent == undefined) {
            return breadcrumbItems
        }

        breadcrumbItems.unshift(...makeBreadcrumbItems(trail[node.parent]!, trail))
        return breadcrumbItems
    }

    const breadcrumb = makeBreadcrumbItems(endNode, trail)

    return (
        <BreadcrumbRoot>
            <BreadcrumbList>{breadcrumb}</BreadcrumbList>
        </BreadcrumbRoot>
    )
}

export default Breadcrumb
