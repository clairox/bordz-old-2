import { BreadcrumbTrail } from '@/types/store'
import Breadcrumb from './Breadcrumb'
import { render } from '@testing-library/react'

describe('Breadcrumb', () => {
    const trail: BreadcrumbTrail = {
        home: {
            title: 'Home',
            href: '/',
            parent: null,
        },
        department: {
            title: 'Snow',
            href: '/snow',
            parent: 'home',
        },
        collection: {
            title: 'Bindings',
            href: '/bindings',
            parent: 'department',
        },
        product: {
            title: 'Red Bindings',
            href: null,
            parent: 'collection',
        },
    }

    it('generates breadcrumb correctly', () => {
        const { getAllByRole, queryAllByRole } = render(
            <Breadcrumb endNode={trail.product!} trail={trail} />,
        )

        const listItems = getAllByRole('listitem')

        expect(listItems[0]).toHaveTextContent('Home')
        expect(listItems[1]).toHaveTextContent('Snow')
        expect(listItems[2]).toHaveTextContent('Bindings')
        expect(listItems[3]).toHaveTextContent('Red Bindings')

        const links = queryAllByRole('link')

        expect(links[0]).toHaveAttribute('href', '/')
        expect(links[1]).toHaveAttribute('href', '/snow')
        expect(links[2]).toHaveAttribute('href', '/bindings')
        expect(links[3]).toBeUndefined()
    })
})
