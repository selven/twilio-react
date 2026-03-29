import { render, screen } from '@/test/utils'
import userEvent from '@testing-library/user-event'
import { Viewer } from './Viewer'

vi.mock('@/hooks/useLocalTracks/useLocalTracks', () => ({ useLocalTracks: vi.fn() }))
vi.mock('@/hooks/useRoom/useRoom', () => ({ useRoom: vi.fn() }))
vi.mock('@/hooks/useParticipants/useParticipants', () => ({ useParticipants: vi.fn() }))
vi.mock('@/hooks/useDominantSpeaker/useDominantSpeaker', () => ({ useDominantSpeaker: vi.fn() }))
vi.mock('@/hooks/useHandRaise/useHandRaise', () => ({ useHandRaise: vi.fn() }))
vi.mock('@/hooks/useBackgroundBlur/useBackgroundBlur', () => ({ useBackgroundBlur: vi.fn() }))
vi.mock('@/lib/twilioToken', () => ({ generateTwilioToken: vi.fn() }))
vi.mock('@/components/LocalTile/LocalTile', () => ({
  LocalTile: ({ participant }: { participant: { identity: string } }) => (
    <div data-testid="local-tile">{participant.identity}</div>
  ),
}))
vi.mock('@/components/RemoteTile/RemoteTile', () => ({
  RemoteTile: ({ participant }: { participant: { identity: string } }) => (
    <div data-testid="remote-tile">{participant.identity}</div>
  ),
}))
vi.mock('@/components/RemoteAudio/RemoteAudio', () => ({ RemoteAudio: () => null }))

import { useLocalTracks } from '@/hooks/useLocalTracks/useLocalTracks'
import { useRoom } from '@/hooks/useRoom/useRoom'
import { useParticipants } from '@/hooks/useParticipants/useParticipants'
import { useDominantSpeaker } from '@/hooks/useDominantSpeaker/useDominantSpeaker'
import { useHandRaise } from '@/hooks/useHandRaise/useHandRaise'
import { useBackgroundBlur } from '@/hooks/useBackgroundBlur/useBackgroundBlur'
import { generateTwilioToken } from '@/lib/twilioToken'

const mockUseLocalTracks = vi.mocked(useLocalTracks)
const mockUseRoom = vi.mocked(useRoom)
const mockUseParticipants = vi.mocked(useParticipants)
const mockUseDominantSpeaker = vi.mocked(useDominantSpeaker)
const mockUseHandRaise = vi.mocked(useHandRaise)
const mockUseBackgroundBlur = vi.mocked(useBackgroundBlur)
const mockGenerateToken = vi.mocked(generateTwilioToken)

const defaultLocalTracks: ReturnType<typeof useLocalTracks> = {
  localTracks: [],
  audioTrack: null,
  videoTrack: null,
  dataTrack: {} as ReturnType<typeof useLocalTracks>['dataTrack'],
  isAudioMuted: false,
  isVideoOff: false,
  isAcquiring: false,
  toggleAudio: vi.fn(),
  toggleVideo: vi.fn(),
}

const defaultRoom: ReturnType<typeof useRoom> = {
  room: null,
  state: 'connected',
  error: null,
  connect: vi.fn(),
  disconnect: vi.fn(),
}

beforeEach(() => {
  mockUseLocalTracks.mockReturnValue(defaultLocalTracks)
  mockUseRoom.mockReturnValue(defaultRoom)
  mockUseParticipants.mockReturnValue([])
  mockUseDominantSpeaker.mockReturnValue(null)
  mockUseHandRaise.mockReturnValue({ raisedHands: new Set(), isRaised: false, toggleHand: vi.fn() })
  mockUseBackgroundBlur.mockReturnValue({ isBlurred: false, toggleBlur: vi.fn() })
  mockGenerateToken.mockResolvedValue('mock-token')
})

function renderViewer(props: { name?: string; onLeave?: () => void } = {}) {
  return render(<Viewer name={props.name ?? 'Alice'} onLeave={props.onLeave ?? vi.fn()} />)
}

describe('<Viewer />', () => {
  describe('@state', () => {
    it('should show loading screen while acquiring camera', () => {
      mockUseLocalTracks.mockReturnValue({ ...defaultLocalTracks, isAcquiring: true })
      mockUseRoom.mockReturnValue({ ...defaultRoom, state: 'disconnected' })
      renderViewer()
      expect(screen.getByText('Preparing camera…')).toBeInTheDocument()
    })

    it('should show connecting screen when not yet connected', () => {
      mockUseRoom.mockReturnValue({ ...defaultRoom, state: 'disconnected' })
      renderViewer()
      expect(screen.getByText('Connecting to room…')).toBeInTheDocument()
    })

    it('should show reconnecting label when state is reconnecting', () => {
      mockUseRoom.mockReturnValue({ ...defaultRoom, state: 'reconnecting' })
      renderViewer()
      expect(screen.getByText('Reconnecting…')).toBeInTheDocument()
    })

    it('should show error message when an error is present', () => {
      mockUseRoom.mockReturnValue({ ...defaultRoom, error: new Error('Connection failed') })
      renderViewer()
      expect(screen.getByText('Connection failed')).toBeInTheDocument()
    })
  })

  describe('@onLeave', () => {
    it('should call onLeave and disconnect when leave button is clicked', async () => {
      const onLeave = vi.fn()
      const disconnect = vi.fn()
      mockUseRoom.mockReturnValue({ ...defaultRoom, disconnect })
      renderViewer({ onLeave })
      await userEvent.click(screen.getByRole('button', { name: 'Leave call' }))
      expect(disconnect).toHaveBeenCalled()
      expect(onLeave).toHaveBeenCalled()
    })
  })

  describe('@participants', () => {
    it('should render LocalTile for the local participant when connected', () => {
      mockUseRoom.mockReturnValue({
        ...defaultRoom,
        room: {
          localParticipant: { identity: 'Alice', sid: 'local-sid' },
        } as ReturnType<typeof useRoom>['room'],
      })
      renderViewer({ name: 'Alice' })
      expect(screen.getByTestId('local-tile')).toBeInTheDocument()
    })

    it('should render RemoteTile for remote participants', () => {
      mockUseParticipants.mockReturnValue([
        { identity: 'Bob', sid: 'remote-sid-1' } as ReturnType<typeof useParticipants>[number],
      ])
      renderViewer()
      expect(screen.getByTestId('remote-tile')).toHaveTextContent('Bob')
    })
  })
})
