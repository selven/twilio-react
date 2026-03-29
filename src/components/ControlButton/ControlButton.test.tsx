import { render, screen } from '@/test/utils'
import userEvent from '@testing-library/user-event'
import { TooltipProvider } from '@/components/ui/tooltip'
import { ControlButton } from './ControlButton'

function renderWithTooltip(ui: React.ReactElement) {
  return render(<TooltipProvider>{ui}</TooltipProvider>)
}

function getButton() {
  return document.querySelector<HTMLButtonElement>('[data-slot="tooltip-trigger"]')!
}

describe('<ControlButton />', () => {
  describe('@label', () => {
    it('should render tooltip content with the label text', async () => {
      renderWithTooltip(
        <ControlButton label="Mute mic" onClick={() => {}} active={false}>
          <span>icon</span>
        </ControlButton>
      )
      await userEvent.hover(getButton())
      expect(await screen.findByText('Mute mic')).toBeInTheDocument()
    })
  })

  describe('@onClick', () => {
    it('should call onClick when the button is clicked', async () => {
      const onClick = vi.fn()
      renderWithTooltip(
        <ControlButton label="Mute mic" onClick={onClick} active={false}>
          <span>icon</span>
        </ControlButton>
      )
      await userEvent.click(getButton())
      expect(onClick).toHaveBeenCalledTimes(1)
    })
  })

  describe('@active', () => {
    it('should apply destructive styling when active is true', () => {
      renderWithTooltip(
        <ControlButton label="Mute mic" onClick={() => {}} active={true}>
          <span>icon</span>
        </ControlButton>
      )
      expect(getButton().className).toContain('text-destructive')
    })

    it('should not apply destructive styling when active is false', () => {
      renderWithTooltip(
        <ControlButton label="Mute mic" onClick={() => {}} active={false}>
          <span>icon</span>
        </ControlButton>
      )
      expect(getButton().className).not.toContain('text-destructive')
    })
  })

  describe('@children', () => {
    it('should render children inside the button', () => {
      renderWithTooltip(
        <ControlButton label="Mute mic" onClick={() => {}} active={false}>
          <span data-testid="icon">icon</span>
        </ControlButton>
      )
      expect(screen.getByTestId('icon')).toBeInTheDocument()
    })
  })
})
