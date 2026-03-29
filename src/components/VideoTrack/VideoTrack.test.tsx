import { render } from '@/test/utils'
import type { LocalVideoTrack } from 'twilio-video'
import { VideoTrack } from './VideoTrack'

function makeTrack() {
  return {
    attach: vi.fn(),
    detach: vi.fn(),
    kind: 'video' as const,
  } as unknown as LocalVideoTrack
}

describe('<VideoTrack />', () => {
  describe('@track', () => {
    it('should call track.attach with the video element on mount', () => {
      const track = makeTrack()
      render(<VideoTrack track={track} />)
      expect(track.attach).toHaveBeenCalledWith(expect.any(HTMLVideoElement))
    })

    it('should call track.detach on unmount', () => {
      const track = makeTrack()
      const { unmount } = render(<VideoTrack track={track} />)
      unmount()
      expect(track.detach).toHaveBeenCalled()
    })

    it('should clear srcObject on unmount', () => {
      const track = makeTrack()
      const { unmount } = render(<VideoTrack track={track} />)
      const el = (track.attach as ReturnType<typeof vi.fn>).mock.calls[0][0] as HTMLVideoElement
      unmount()
      expect(el.srcObject).toBeNull()
    })
  })

  describe('@isLocal', () => {
    it('should set muted attribute when isLocal is true', () => {
      const track = makeTrack()
      const { container } = render(<VideoTrack track={track} isLocal />)
      expect(container.querySelector('video')?.muted).toBe(true)
    })

    it('should apply mirror transform style when isLocal is true', () => {
      const track = makeTrack()
      const { container } = render(<VideoTrack track={track} isLocal />)
      expect(container.querySelector('video')).toHaveStyle({ transform: 'scaleX(-1)' })
    })

    it('should not apply mirror transform when isLocal is false', () => {
      const track = makeTrack()
      const { container } = render(<VideoTrack track={track} />)
      expect(container.querySelector('video')).not.toHaveStyle({ transform: 'scaleX(-1)' })
    })
  })
})
