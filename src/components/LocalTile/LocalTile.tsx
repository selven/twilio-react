import { useTranslations } from 'use-intl'
import type { LocalParticipant, LocalVideoTrack, RemoteParticipant } from 'twilio-video'
import { Tile } from '@/components/Tile/Tile'
import { VideoTrack } from '@/components/VideoTrack/VideoTrack'

interface Props {
  participant: LocalParticipant | RemoteParticipant
  videoTrack: LocalVideoTrack | null
  isAudioMuted: boolean
  isVideoOff: boolean
  isHandRaised?: boolean
  size: 'main' | 'thumb'
}

export function LocalTile({ participant, videoTrack, isAudioMuted, isVideoOff, isHandRaised, size }: Props) {
  const t = useTranslations('Tile')
  return (
    <Tile name={participant.identity} label={t('you')} isMuted={isAudioMuted} isHandRaised={isHandRaised} size={size}>
      {videoTrack && !isVideoOff ? <VideoTrack track={videoTrack} isLocal /> : null}
    </Tile>
  )
}
