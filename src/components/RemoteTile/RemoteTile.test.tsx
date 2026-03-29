import { render, screen } from '@/test/utils'
import type { RemoteParticipant } from 'twilio-video'
import { RemoteTile } from './RemoteTile'

vi.mock('@/components/VideoTrack/VideoTrack', () => ({
  VideoTrack: () => <div data-testid="video-track" />,
}))

vi.mock('@/hooks/usePublications/usePublications', () => ({
  usePublications: vi.fn(),
}))

vi.mock('@/hooks/useTrack/useTrack', () => ({
  useTrack: vi.fn(),
}))

vi.mock('@/hooks/usePublicationIsEnabled/usePublicationIsEnabled', () => ({
  usePublicationIsEnabled: vi.fn(),
}))

import { usePublications } from '@/hooks/usePublications/usePublications'
import { useTrack } from '@/hooks/useTrack/useTrack'
import { usePublicationIsEnabled } from '@/hooks/usePublicationIsEnabled/usePublicationIsEnabled'

const mockUsePublications = vi.mocked(usePublications)
const mockUseTrack = vi.mocked(useTrack)
const mockUsePublicationIsEnabled = vi.mocked(usePublicationIsEnabled)

function makeParticipant(identity: string): RemoteParticipant {
  return { identity } as unknown as RemoteParticipant
}

function makeVideoPub() {
  return { kind: 'video' as const } as ReturnType<typeof usePublications>[number]
}

function makeAudioPub() {
  return { kind: 'audio' as const } as ReturnType<typeof usePublications>[number]
}

function makeVideoTrack() {
  return { kind: 'video' as const } as ReturnType<typeof useTrack>
}

describe('<RemoteTile />', () => {
  beforeEach(() => {
    mockUsePublications.mockReturnValue([])
    mockUseTrack.mockReturnValue(null)
    mockUsePublicationIsEnabled.mockReturnValue(true)
  })

  describe('@participant', () => {
    it('should display participant identity', () => {
      render(<RemoteTile participant={makeParticipant('Bob')} size="thumb" />)
      expect(screen.getByText('Bob')).toBeInTheDocument()
    })

    it('should show mute icon when audio publication is disabled', () => {
      mockUsePublications.mockReturnValue([makeAudioPub()])
      mockUsePublicationIsEnabled.mockImplementation((pub) =>
        pub?.kind === 'audio' ? false : true
      )
      const { container } = render(<RemoteTile participant={makeParticipant('Bob')} size="thumb" />)
      expect(container.querySelector('svg')).toBeInTheDocument()
    })

    it('should not show mute icon when audio publication is enabled', () => {
      mockUsePublications.mockReturnValue([makeAudioPub()])
      mockUsePublicationIsEnabled.mockReturnValue(true)
      render(<RemoteTile participant={makeParticipant('Bob')} size="thumb" />)
      // no svg in the mute area — avatar fallback renders no svg
      const muteEl = document.querySelector('.flex-shrink-0 svg')
      expect(muteEl).not.toBeInTheDocument()
    })

    it('should render VideoTrack when video is subscribed and enabled', () => {
      const videoPub = makeVideoPub()
      mockUsePublications.mockReturnValue([videoPub])
      mockUseTrack.mockReturnValue(makeVideoTrack())
      mockUsePublicationIsEnabled.mockReturnValue(true)
      render(<RemoteTile participant={makeParticipant('Bob')} size="thumb" />)
      expect(screen.getByTestId('video-track')).toBeInTheDocument()
    })

    it('should not render VideoTrack when video publication is disabled', () => {
      const videoPub = makeVideoPub()
      mockUsePublications.mockReturnValue([videoPub])
      mockUseTrack.mockReturnValue(makeVideoTrack())
      mockUsePublicationIsEnabled.mockReturnValue(false)
      render(<RemoteTile participant={makeParticipant('Bob')} size="thumb" />)
      expect(screen.queryByTestId('video-track')).not.toBeInTheDocument()
    })

    it('should not render VideoTrack when track is not yet subscribed', () => {
      mockUsePublications.mockReturnValue([makeVideoPub()])
      mockUseTrack.mockReturnValue(null)
      mockUsePublicationIsEnabled.mockReturnValue(true)
      render(<RemoteTile participant={makeParticipant('Bob')} size="thumb" />)
      expect(screen.queryByTestId('video-track')).not.toBeInTheDocument()
    })
  })

  describe('@size', () => {
    it('should pass size prop to Tile', () => {
      const { container } = render(<RemoteTile participant={makeParticipant('Bob')} size="thumb" />)
      expect(container.firstChild).toHaveClass('w-40')
    })
  })
})
