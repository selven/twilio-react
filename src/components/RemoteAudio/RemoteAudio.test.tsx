import { render } from '@/test/utils'
import type { RemoteParticipant, RemoteAudioTrack } from 'twilio-video'
import { RemoteAudio } from './RemoteAudio'

vi.mock('@/hooks/usePublications/usePublications', () => ({
  usePublications: vi.fn(),
}))

vi.mock('@/hooks/useTrack/useTrack', () => ({
  useTrack: vi.fn(),
}))

import { usePublications } from '@/hooks/usePublications/usePublications'
import { useTrack } from '@/hooks/useTrack/useTrack'

const mockUsePublications = vi.mocked(usePublications)
const mockUseTrack = vi.mocked(useTrack)

function makeParticipant(): RemoteParticipant {
  return {} as unknown as RemoteParticipant
}

function makeAudioTrack() {
  return {
    kind: 'audio' as const,
    attach: vi.fn(),
    detach: vi.fn(),
  } as unknown as RemoteAudioTrack
}

describe('<RemoteAudio />', () => {
  beforeEach(() => {
    mockUsePublications.mockReturnValue([])
    mockUseTrack.mockReturnValue(null)
  })

  describe('@participant', () => {
    it('should render an audio element', () => {
      const { container } = render(<RemoteAudio participant={makeParticipant()} />)
      expect(container.querySelector('audio')).toBeInTheDocument()
    })

    it('should call track.attach when audio track is available', () => {
      const track = makeAudioTrack()
      mockUseTrack.mockReturnValue(track)
      render(<RemoteAudio participant={makeParticipant()} />)
      expect(track.attach).toHaveBeenCalledWith(expect.any(HTMLAudioElement))
    })

    it('should call track.detach on unmount', () => {
      const track = makeAudioTrack()
      mockUseTrack.mockReturnValue(track)
      const { unmount } = render(<RemoteAudio participant={makeParticipant()} />)
      unmount()
      expect(track.detach).toHaveBeenCalled()
    })

    it('should not call attach when track is null', () => {
      mockUseTrack.mockReturnValue(null)
      render(<RemoteAudio participant={makeParticipant()} />)
      // no error thrown, no attach calls — test passes if it renders without throwing
    })
  })
})
