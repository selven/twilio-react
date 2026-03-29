import { render, screen } from '@/test/utils'
import userEvent from '@testing-library/user-event'
import { Landing } from './Landing'

async function fillAndSubmit(name: string, room: string) {
  if (name) await userEvent.type(screen.getByLabelText('Your name'), name)
  if (room) await userEvent.type(screen.getByLabelText('Room name'), room)
}

describe('<Landing />', () => {
  describe('@onSubmit', () => {
    it('should call onSubmit with trimmed name and room when Join is clicked', async () => {
      const onSubmit = vi.fn()
      render(<Landing onSubmit={onSubmit} />)
      await fillAndSubmit('Alice', 'my-room')
      await userEvent.click(screen.getByRole('button', { name: 'Join' }))
      expect(onSubmit).toHaveBeenCalledWith('Alice', 'my-room')
    })

    it('should call onSubmit when Enter is pressed', async () => {
      const onSubmit = vi.fn()
      render(<Landing onSubmit={onSubmit} />)
      await userEvent.type(screen.getByLabelText('Your name'), 'Alice')
      await userEvent.type(screen.getByLabelText('Room name'), 'my-room{Enter}')
      expect(onSubmit).toHaveBeenCalledWith('Alice', 'my-room')
    })

    it('should trim whitespace before calling onSubmit', async () => {
      const onSubmit = vi.fn()
      render(<Landing onSubmit={onSubmit} />)
      await fillAndSubmit('  Bob  ', '  room-1  ')
      await userEvent.click(screen.getByRole('button', { name: 'Join' }))
      expect(onSubmit).toHaveBeenCalledWith('Bob', 'room-1')
    })
  })

  describe('@validation', () => {
    it('should disable Join when both fields are empty', () => {
      render(<Landing onSubmit={() => {}} />)
      expect(screen.getByRole('button', { name: 'Join' })).toBeDisabled()
    })

    it('should disable Join when only name is filled', async () => {
      render(<Landing onSubmit={() => {}} />)
      await userEvent.type(screen.getByLabelText('Your name'), 'Alice')
      expect(screen.getByRole('button', { name: 'Join' })).toBeDisabled()
    })

    it('should disable Join when only room is filled', async () => {
      render(<Landing onSubmit={() => {}} />)
      await userEvent.type(screen.getByLabelText('Room name'), 'my-room')
      expect(screen.getByRole('button', { name: 'Join' })).toBeDisabled()
    })

    it('should enable Join when both fields have 2 or more characters', async () => {
      render(<Landing onSubmit={() => {}} />)
      await fillAndSubmit('Al', 'ro')
      expect(screen.getByRole('button', { name: 'Join' })).not.toBeDisabled()
    })

    it('should not call onSubmit when name is fewer than 2 characters', async () => {
      const onSubmit = vi.fn()
      render(<Landing onSubmit={onSubmit} />)
      await userEvent.type(screen.getByLabelText('Your name'), 'A')
      await userEvent.type(screen.getByLabelText('Room name'), 'my-room{Enter}')
      expect(onSubmit).not.toHaveBeenCalled()
    })
  })
})
