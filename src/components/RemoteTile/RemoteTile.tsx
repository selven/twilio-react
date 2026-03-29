import type { RemoteParticipant, RemoteVideoTrack } from 'twilio-video'
import { Tile } from '@/components/Tile/Tile'
import { VideoTrack } from '@/components/VideoTrack/VideoTrack'
import { usePublications } from '@/hooks/usePublications/usePublications'
import { useTrack } from '@/hooks/useTrack/useTrack'
import { usePublicationIsEnabled } from '@/hooks/usePublicationIsEnabled/usePublicationIsEnabled'

interface Props {
  participant: RemoteParticipant
  isHandRaised?: boolean
  size: 'main' | 'thumb'
}

export function RemoteTile({ participant, isHandRaised, size }: Props) {
  const publications = usePublications(participant)
  const videoPub = publications.find(p => p.kind === 'video') ?? null
  const audioPub = publications.find(p => p.kind === 'audio') ?? null
  const track = useTrack(videoPub)
  const videoTrack = track?.kind === 'video' ? (track as RemoteVideoTrack) : null
  const isVideoEnabled = usePublicationIsEnabled(videoPub)
  const isAudioEnabled = usePublicationIsEnabled(audioPub)

  return (
    <Tile name={participant.identity} isMuted={!isAudioEnabled} isHandRaised={isHandRaised} size={size}>
      {videoTrack && isVideoEnabled ? <VideoTrack track={videoTrack} /> : null}
    </Tile>
  )
}
