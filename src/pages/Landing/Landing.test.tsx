import { render, screen } from '@/test/utils'
import userEvent from '@testing-library/user-event'
import { Landing } from './Landing'

describe('<Landing />', () => {
  describe('@onSubmit', () => {
    it('should call onSubmit with the trimmed name when Join is clicked', async () => {
      const onSubmit = vi.fn()
      render(<Landing onSubmit={onSubmit} />)
      await userEvent.type(screen.getByLabelText('Your name'), 'Alice')
      await userEvent.click(screen.getByRole('button', { name: 'Join' }))
      expect(onSubmit).toHaveBeenCalledWith('Alice')
    })

    it('should call onSubmit when Enter is pressed', async () => {
      const onSubmit = vi.fn()
      render(<Landing onSubmit={onSubmit} />)
      await userEvent.type(screen.getByLabelText('Your name'), 'Alice{Enter}')
      expect(onSubmit).toHaveBeenCalledWith('Alice')
    })

    it('should trim whitespace before calling onSubmit', async () => {
      const onSubmit = vi.fn()
      render(<Landing onSubmit={onSubmit} />)
      await userEvent.type(screen.getByLabelText('Your name'), '  Bob  ')
      await userEvent.click(screen.getByRole('button', { name: 'Join' }))
      expect(onSubmit).toHaveBeenCalledWith('Bob')
    })
  })

  describe('@name validation', () => {
    it('should disable Join when name is fewer than 2 characters', () => {
      render(<Landing onSubmit={() => {}} />)
      expect(screen.getByRole('button', { name: 'Join' })).toBeDisabled()
    })

    it('should enable Join when name is 2 or more characters', async () => {
      render(<Landing onSubmit={() => {}} />)
      await userEvent.type(screen.getByLabelText('Your name'), 'Al')
      expect(screen.getByRole('button', { name: 'Join' })).not.toBeDisabled()
    })

    it('should not call onSubmit when name is fewer than 2 characters', async () => {
      const onSubmit = vi.fn()
      render(<Landing onSubmit={onSubmit} />)
      await userEvent.type(screen.getByLabelText('Your name'), 'A{Enter}')
      expect(onSubmit).not.toHaveBeenCalled()
    })
  })
})
