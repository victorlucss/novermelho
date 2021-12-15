import { render } from '@testing-library/react'
import { Modal } from '.'

describe('Modal component', () => {
    it('renders correctly', () => {
        const { getByText }  = render(
            <Modal isOpen onClose={() => console.log('onClose')}> 
                <h1>Are you sure about this action?</h1>
            </Modal>
        )
    
        expect(getByText('Are you sure about this action?')).toBeInTheDocument()
    })
})
