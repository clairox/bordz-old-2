import { render } from '@testing-library/react'
import CollectionHeader from './CollectionHeader'
import _ from 'lodash'

vi.mock('next/navigation', () => ({
    usePathname: vi.fn().mockReturnValue('test-collection'),
}))

describe('CollectionHeader', () => {
    it('renders and shows title', () => {
        const title = 'Test Collection Title'
        const { getByRole, unmount } = render(
            <CollectionHeader title={title} pathname={'test-collection'} />,
        )

        expect(getByRole('heading', { level: 1, name: title })).toBeVisible()
        unmount()
    })

    it('renders and shows subcollection links', () => {
        const subcategoryTitles = ['Subcollection 1', 'Subcollection 2']
        const { getByRole, unmount } = render(
            <CollectionHeader
                title={''}
                subcategoryTitles={subcategoryTitles}
                pathname={'/test-collection'}
            />,
        )

        expect(getByRole('link', { name: 'Subcollection 1' })).toBeVisible()
        expect(getByRole('link', { name: 'Subcollection 2' })).toBeVisible()
        unmount()
    })

    describe('subcollection link', () => {
        it('links to subcollection page', () => {
            const subcategoryTitles = ['Subcollection 1', 'Subcollection 2']
            const { getByRole, unmount } = render(
                <CollectionHeader
                    title={''}
                    subcategoryTitles={subcategoryTitles}
                    pathname={'/test-collection'}
                />,
            )

            expect(getByRole('link', { name: 'Subcollection 1' })).toHaveAttribute(
                'href',
                '/test-collection/subcollection-1',
            )
            unmount()
        })
    })
})
