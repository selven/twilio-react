import { useEffect, useRef } from 'react'
import type { RemoteParticipant } from 'twilio-video'
import { usePublications } from '@/hooks/usePublications/usePublications'
import { useTrack } from '@/hooks/useTrack/useTrack'

interface Props {
  participant: RemoteParticipant
}

export function RemoteAudio({ participant }: Props) {
  const publications = usePublications(participant)
  const audioPub = publications.find(p => p.kind === 'audio') ?? null
  const track = useTrack(audioPub)
  const ref = useRef<HTMLAudioElement>(null!)

  useEffect(() => {
    if (!track || track.kind !== 'audio') return
    const el = ref.current
    track.attach(el)
    return () => { track.detach(el) }
  }, [track])

  return <audio ref={ref} autoPlay />
}
