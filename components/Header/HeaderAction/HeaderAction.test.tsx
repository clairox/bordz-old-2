import { render } from '@testing-library/react'
import HeaderButton from './HeaderAction'

describe('HeaderAction', () => {
	it('should have class border-b when triggered is false', () => {
		const { getByRole } = render(
			<HeaderButton triggered={false}>
				<div></div>
			</HeaderButton>
		)

		expect(getByRole('button')).toHaveClass('border-b')
	})
	it('should not have class border-b when triggered is true', () => {
		const { getByRole } = render(
			<HeaderButton triggered={true}>
				<div></div>
			</HeaderButton>
		)

		expect(getByRole('button')).not.toHaveClass('border-b')
	})
})
