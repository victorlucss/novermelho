import { render, screen } from '@testing-library/react'
import { MoneyInput } from '.'

describe('Modal component', () => {
    it('renders correctly', () => {
        render(
            <MoneyInput name='input' label='label'/>
        )
    
        expect(screen.getByText('label')).toBeInTheDocument()
    })
})
