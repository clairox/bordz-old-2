import { render } from '@testing-library/react'
import FormSuccessBox from './FormSuccessBox'

describe('FormSuccessBox', () => {
	it('renders and shows success message', () => {
		const { getByText } = render(<FormSuccessBox>{'Test Success'}</FormSuccessBox>)
		expect(getByText('Test Success')).toBeVisible()
	})
})
