import { render } from '@testing-library/react'
import FormErrorBox from './FormErrorBox'

describe('FormErrorBox', () => {
	it('renders and shows error message', () => {
		const { getByText } = render(<FormErrorBox>{'Test Error'}</FormErrorBox>)
		expect(getByText('Test Error')).toBeVisible()
	})
})
