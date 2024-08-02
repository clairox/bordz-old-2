import { render } from '@testing-library/react'
import ProductGallery from './ProductGallery'

describe('ProductGallery', () => {
	const images = [
		{
			src: '/testsrc.com/image1',
			width: 100,
			height: 100,
		},
		{
			src: '/testsrc.com/image2',
			width: 100,
			height: 100,
		},
	]
	it('renders first product image', () => {
		const { getByRole } = render(<ProductGallery images={images} />)

		expect(getByRole('img')).toHaveAttribute(
			'src',
			'/_next/image?url=%2Ftestsrc.com%2Fimage1&w=256&q=75'
		)
	})
})
