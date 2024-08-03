import RangeSlider from './RangeSlider'
import { render } from '@testing-library/react'

const ResizeObserverMock = vi.fn(() => ({
	observe: vi.fn(),
	unobserve: vi.fn(),
	disconnect: vi.fn(),
}))

vi.stubGlobal('ResizeObserver', ResizeObserverMock)

describe('RangeSlider', () => {
	const setValue = vi.fn()
	const setRenderedValue = vi.fn()
	const renderedValue = [0, 85]
	const min = 0
	const max = 0

	it('renders and shows slider', () => {
		const { getByTestId, unmount } = render(
			<RangeSlider
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
})
