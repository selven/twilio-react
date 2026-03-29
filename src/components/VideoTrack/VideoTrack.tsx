import { useEffect, useRef } from 'react'
import type { LocalVideoTrack, RemoteVideoTrack } from 'twilio-video'

interface Props {
  track: LocalVideoTrack | RemoteVideoTrack
  isLocal?: boolean
}

export function VideoTrack({ track, isLocal }: Props) {
  const ref = useRef<HTMLVideoElement>(null!)

  useEffect(() => {
    const el = ref.current
    track.attach(el)
    return () => {
      track.detach(el)
      el.srcObject = null
    }
  }, [track])

  return (
    <video
      ref={ref}
      autoPlay
      playsInline
      muted={isLocal}
      className="w-full h-full object-cover"
      style={isLocal ? { transform: 'scaleX(-1)' } : undefined}
    />
  )
}
