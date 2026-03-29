import { render, screen } from '@/test/utils'
import type { LocalParticipant, LocalVideoTrack } from 'twilio-video'
import { LocalTile } from './LocalTile'

vi.mock('@/components/VideoTrack/VideoTrack', () => ({
  VideoTrack: () => <div data-testid="video-track" />,
}))

function makeParticipant(identity: string): LocalParticipant {
  return { identity } as unknown as LocalParticipant
}

function makeVideoTrack(): LocalVideoTrack {
  return {} as unknown as LocalVideoTrack
}

describe('<LocalTile />', () => {
  describe('@videoTrack', () => {
    it('should render VideoTrack when videoTrack is provided and isVideoOff is false', () => {
      render(
        <LocalTile
          participant={makeParticipant('Alice')}
          videoTrack={makeVideoTrack()}
          isAudioMuted={false}
          isVideoOff={false}
          size="thumb"
        />
      )
      expect(screen.getByTestId('video-track')).toBeInTheDocument()
    })

    it('should not render VideoTrack when videoTrack is null', () => {
      render(
        <LocalTile
          participant={makeParticipant('Alice')}
          videoTrack={null}
          isAudioMuted={false}
          isVideoOff={false}
          size="thumb"
        />
      )
      expect(screen.queryByTestId('video-track')).not.toBeInTheDocument()
    })

    it('should not render VideoTrack when isVideoOff is true', () => {
      render(
        <LocalTile
          participant={makeParticipant('Alice')}
          videoTrack={makeVideoTrack()}
          isAudioMuted={false}
          isVideoOff={true}
          size="thumb"
        />
      )
      expect(screen.queryByTestId('video-track')).not.toBeInTheDocument()
    })
  })

  describe('@isAudioMuted', () => {
    it('should show mute icon when isAudioMuted is true', () => {
      const { container } = render(
        <LocalTile
          participant={makeParticipant('Alice')}
          videoTrack={null}
          isAudioMuted={true}
          isVideoOff={false}
          size="thumb"
        />
      )
      expect(container.querySelector('svg')).toBeInTheDocument()
    })
  })

  describe('@participant', () => {
    it('should display participant identity as name', () => {
      render(
        <LocalTile
          participant={makeParticipant('Alice')}
          videoTrack={null}
          isAudioMuted={false}
          isVideoOff={false}
          size="thumb"
        />
      )
      expect(screen.getByText(/Alice/)).toBeInTheDocument()
    })

    it('should display "you" as label', () => {
      render(
        <LocalTile
          participant={makeParticipant('Alice')}
          videoTrack={null}
          isAudioMuted={false}
          isVideoOff={false}
          size="thumb"
        />
      )
      expect(screen.getByText('Alice (you)')).toBeInTheDocument()
    })
  })
})
