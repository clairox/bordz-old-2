import { render } from '@testing-library/react'
import Navbar from '.'

describe.skip('navbar component', () => {
	it('should render', () => {
		const { getByRole, unmount } = render(<Navbar />)
		expect(getByRole('banner')).toBeVisible()
		unmount()
	})

	it('should render brand logo link', () => {
		const { getByRole, unmount } = render(<Navbar />)
		expect(getByRole('link', { name: /bordz logo/i })).toBeVisible()
		unmount()
	})

	it('should render search bar component', () => {
		const { getByRole, unmount } = render(<Navbar />)
		expect(getByRole('search')).toBeVisible()
		unmount()
	})
})
