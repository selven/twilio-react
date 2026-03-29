import { render, screen } from '@/test/utils'
import userEvent from '@testing-library/user-event'
import App from './App'

vi.mock('@/pages/Landing/Landing', () => ({
  Landing: ({ onSubmit }: { onSubmit: (name: string, roomName: string) => void }) => (
    <button onClick={() => onSubmit('Alice', 'test-room')}>Join</button>
  ),
}))

vi.mock('@/pages/Viewer/Viewer', () => ({
  Viewer: ({ name, roomName, onLeave }: { name: string; roomName: string; onLeave: () => void }) => (
    <div>
      <span data-testid="viewer-name">{name}</span>
      <span data-testid="viewer-room">{roomName}</span>
      <button onClick={onLeave}>Leave</button>
    </div>
  ),
}))

describe('<App />', () => {
  it('should show Landing initially', () => {
    render(<App />)
    expect(screen.getByText('Join')).toBeInTheDocument()
  })

  it('should show Viewer with name and room after Landing submits', async () => {
    render(<App />)
    await userEvent.click(screen.getByText('Join'))
    expect(screen.getByTestId('viewer-name')).toHaveTextContent('Alice')
    expect(screen.getByTestId('viewer-room')).toHaveTextContent('test-room')
  })

  it('should return to Landing when Viewer calls onLeave', async () => {
    render(<App />)
    await userEvent.click(screen.getByText('Join'))
    await userEvent.click(screen.getByText('Leave'))
    expect(screen.getByText('Join')).toBeInTheDocument()
  })
})
