import { render, fireEvent } from '@testing-library/react'
import { MoneyInput } from '.'

describe('Modal component', () => {
    it('renders correctly', () => {
        const { getByText }  = render(
            <MoneyInput name='input' label='label'/>
        )
    
        expect(getByText('label')).toBeInTheDocument()
    })
})
