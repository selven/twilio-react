import { render, screen } from '@/test/utils'
import { Tile } from './Tile'

describe('<Tile />', () => {
  describe('@name', () => {
    it('should render the participant name', () => {
      render(<Tile name="Alice" size="thumb">{null}</Tile>)
      expect(screen.getByText('Alice')).toBeInTheDocument()
    })

    it('should display avatar fallback with first letter when no children', () => {
      render(<Tile name="Alice" size="thumb">{null}</Tile>)
      expect(screen.getByText('A')).toBeInTheDocument()
    })
  })

  describe('@label', () => {
    it('should append label in parentheses when provided', () => {
      render(<Tile name="Alice" label="you" size="thumb">{null}</Tile>)
      expect(screen.getByText('Alice (you)')).toBeInTheDocument()
    })

    it('should not render parentheses when label is omitted', () => {
      render(<Tile name="Alice" size="thumb">{null}</Tile>)
      expect(screen.queryByText(/\(/)).not.toBeInTheDocument()
    })
  })

  describe('@isMuted', () => {
    it('should show mute icon when isMuted is true', () => {
      const { container } = render(<Tile name="Alice" isMuted={true} size="thumb">{null}</Tile>)
      expect(container.querySelector('svg')).toBeInTheDocument()
    })

    it('should not render mute icon when isMuted is false', () => {
      render(<Tile name="Alice" isMuted={false} size="thumb">{null}</Tile>)
      // avatar fallback also has no svg — only the name badge area
      const spans = screen.getAllByRole('generic', { hidden: true })
      const muteSpan = spans.find(el => el.className.includes('rounded-lg flex-shrink-0'))
      expect(muteSpan).toBeUndefined()
    })
  })

  describe('@size', () => {
    it('should apply main size classes when size is main', () => {
      const { container } = render(<Tile name="Alice" size="main">{null}</Tile>)
      expect(container.firstChild).toHaveClass('aspect-video')
      expect(container.firstChild).toHaveClass('max-w-4xl')
    })

    it('should apply thumb size class when size is thumb', () => {
      const { container } = render(<Tile name="Alice" size="thumb">{null}</Tile>)
      expect(container.firstChild).toHaveClass('w-40')
      expect(container.firstChild).toHaveClass('aspect-video')
    })
  })

  describe('@children', () => {
    it('should render children instead of avatar fallback when provided', () => {
      render(
        <Tile name="Alice" size="thumb">
          <div data-testid="video" />
        </Tile>
      )
      expect(screen.getByTestId('video')).toBeInTheDocument()
      expect(screen.queryByText('A')).not.toBeInTheDocument()
    })
  })
})
