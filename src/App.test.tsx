import { render, screen } from '@/test/utils'
import userEvent from '@testing-library/user-event'
import App from './App'

vi.mock('@/pages/Landing/Landing', () => ({
  Landing: ({ onSubmit }: { onSubmit: (name: string) => void }) => (
    <button onClick={() => onSubmit('Alice')}>Join</button>
  ),
}))

vi.mock('@/pages/Viewer/Viewer', () => ({
  Viewer: ({ name, onLeave }: { name: string; onLeave: () => void }) => (
    <div>
      <span data-testid="viewer-name">{name}</span>
      <button onClick={onLeave}>Leave</button>
    </div>
  ),
}))

describe('<App />', () => {
  describe('@name', () => {
    it('should show Landing initially', () => {
      render(<App />)
      expect(screen.getByText('Join')).toBeInTheDocument()
    })

    it('should show Viewer with the submitted name after Landing submits', async () => {
      render(<App />)
      await userEvent.click(screen.getByText('Join'))
      expect(screen.getByTestId('viewer-name')).toHaveTextContent('Alice')
    })

    it('should return to Landing when Viewer calls onLeave', async () => {
      render(<App />)
      await userEvent.click(screen.getByText('Join'))
      await userEvent.click(screen.getByText('Leave'))
      expect(screen.getByText('Join')).toBeInTheDocument()
    })
  })
})
