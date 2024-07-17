import { render } from '@testing-library/react'
import { CollectionSidebarMenu, CollectionSidebarMenuItem } from './CollectionSidebarMenu'
import userEvent from '@testing-library/user-event'

const setOpenRefinements = vi.fn()

describe('CollectionSideBarMenu', () => {
	it('renders and shows children', () => {
		const { getByTestId, unmount } = render(
			<CollectionSidebarMenu openRefinements={[]} setOpenRefinements={setOpenRefinements}>
				<div data-testid="child">Child</div>
			</CollectionSidebarMenu>
		)

		expect(getByTestId('child')).toBeVisible()
		unmount()
	})
	it('calls setOpenRefinements with correct value when accordion state changes', async () => {
		const { getByText, unmount } = render(
			<CollectionSidebarMenu openRefinements={[]} setOpenRefinements={setOpenRefinements}>
				<CollectionSidebarMenuItem title="Item 1">Content 1</CollectionSidebarMenuItem>
				<CollectionSidebarMenuItem title="Item 2">Content 2</CollectionSidebarMenuItem>
			</CollectionSidebarMenu>
		)

		await userEvent.click(getByText('Item 1'))
		expect(setOpenRefinements).toHaveBeenCalledWith(['Item 1'])
		unmount()
	})
})

describe('CollectionSidebarMenuItem', () => {
	it('renders and shows title and children', () => {
		const { getByText, getByTestId, unmount } = render(
			<CollectionSidebarMenu openRefinements={['Item 1']} setOpenRefinements={setOpenRefinements}>
				<CollectionSidebarMenuItem title="Item 1">
					<div data-testid="child">Child</div>
				</CollectionSidebarMenuItem>
			</CollectionSidebarMenu>
		)

		expect(getByText('Item 1')).toBeVisible()
		expect(getByTestId('child')).toBeVisible()
		unmount()
	})

	it('calls setOpenRefinements with correct value on click', async () => {
		const { getByText, unmount } = render(
			<CollectionSidebarMenu openRefinements={[]} setOpenRefinements={setOpenRefinements}>
				<CollectionSidebarMenuItem title="Item 1">Content 1</CollectionSidebarMenuItem>
			</CollectionSidebarMenu>
		)

		await userEvent.click(getByText('Item 1'))
		expect(setOpenRefinements).toHaveBeenCalledWith(['Item 1'])
		unmount()
	})
})
