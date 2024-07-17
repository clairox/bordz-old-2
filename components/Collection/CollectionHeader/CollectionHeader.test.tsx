import { render } from '@testing-library/react'
import CollectionHeader from './CollectionHeader'
import _ from 'lodash'

vi.mock('next/navigation', () => ({
	useRouter: vi.fn().mockReturnValue({ push: vi.fn() }),
	usePathname: vi.fn().mockReturnValue('test-collection'),
	useParams: vi.fn().mockReturnValue({ collection: ['test-collection'] }),
}))

describe('CollectionHeader', () => {
	it('renders and shows title', () => {
		const title = 'Test Collection Title'
		const { getByRole, unmount } = render(<CollectionHeader title={title} />)

		expect(getByRole('heading', { level: 1, name: title })).toBeVisible()
		unmount()
	})

	it('renders and shows subcollection links', () => {
		const subcollectionTitles = ['subcollection-1', 'subcollection-2']
		const { getByRole, unmount } = render(
			<CollectionHeader title={''} subcollectionTitles={subcollectionTitles} />
		)

		expect(getByRole('link', { name: 'Subcollection 1' })).toBeVisible()
		expect(getByRole('link', { name: 'Subcollection 2' })).toBeVisible()
		unmount()
	})

	describe('subcollection link', () => {
		it('links to subcollection page', () => {
			const subcollectionTitles = ['subcollection-1', 'subcollection-2']
			const { getByRole, unmount } = render(
				<CollectionHeader title={''} subcollectionTitles={subcollectionTitles} />
			)

			expect(getByRole('link', { name: 'Subcollection 1' })).toHaveAttribute(
				'href',
				'test-collection/subcollection-1'
			)
			unmount()
		})
	})
})
