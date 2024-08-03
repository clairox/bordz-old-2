import PriceRangeSlider from './PriceRangeSlider'
import { render } from '@testing-library/react'

const ResizeObserverMock = vi.fn(() => ({
	observe: vi.fn(),
	unobserve: vi.fn(),
	disconnect: vi.fn(),
}))

vi.stubGlobal('ResizeObserver', ResizeObserverMock)

describe('PriceRangeSlider', () => {
	const setValue = vi.fn()
	const setRenderedValue = vi.fn()
	const renderedValue = [0, 85]
	const min = 0
	const max = 0

	it('renders and shows slider', () => {
		const { getByTestId, unmount } = render(
			<PriceRangeSlider
				setValue={setValue}
				setRenderedValue={setRenderedValue}
				renderedValue={renderedValue}
				min={min}
				max={max}
			/>
		)

		expect(getByTestId('slider')).toBeVisible()
		unmount()
	})

	it('renders and shows price range values', () => {
		const { getByText, unmount } = render(
			<PriceRangeSlider
				setValue={setValue}
				setRenderedValue={setRenderedValue}
				renderedValue={renderedValue}
				min={min}
				max={max}
			/>
		)

		expect(getByText('$0')).toBeVisible()
		expect(getByText('$85')).toBeVisible()
		unmount()
	})
})
