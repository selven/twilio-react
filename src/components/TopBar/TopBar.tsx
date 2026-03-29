import { useTranslations } from 'use-intl'
import { Hand, Mic, MicOff, Video as VideoIcon, VideoOff, PhoneOff, Wallpaper } from 'lucide-react'
import { ControlButton } from '@/components/ControlButton/ControlButton'
import type { RoomState } from '@/hooks/useRoom/useRoom'

interface Props {
  roomName: string
  state: RoomState
  isAudioMuted: boolean
  isVideoOff: boolean
  isBlurred: boolean
  isRaised: boolean
  onToggleAudio: () => void
  onToggleVideo: () => void
  onToggleBlur: () => void
  onToggleHand: () => void
  onLeave: () => void
}

export function TopBar({
  roomName,
  state,
  isAudioMuted,
  isVideoOff,
  isBlurred,
  isRaised,
  onToggleAudio,
  onToggleVideo,
  onToggleBlur,
  onToggleHand,
  onLeave,
}: Props) {
  const t = useTranslations('TopBar')
  return (
    <div className="border-b border-border bg-card">
      <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
        <span className="text-sm font-medium text-foreground truncate">{roomName}</span>

        {state === 'reconnecting' && (
          <span className="text-xs text-muted-foreground">{t('reconnecting')}</span>
        )}

        <div className="flex items-center gap-1.5">
          <ControlButton
            label={isAudioMuted ? t('unmuteMic') : t('muteMic')}
            onClick={onToggleAudio}
            active={isAudioMuted}
          >
            {isAudioMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </ControlButton>

          <ControlButton
            label={isVideoOff ? t('startVideo') : t('stopVideo')}
            onClick={onToggleVideo}
            active={isVideoOff}
          >
            {isVideoOff ? <VideoOff className="w-4 h-4" /> : <VideoIcon className="w-4 h-4" />}
          </ControlButton>

          <ControlButton
            label={isBlurred ? t('removeBlur') : t('blurBackground')}
            onClick={onToggleBlur}
            active={isBlurred}
          >
            <Wallpaper className="w-4 h-4" />
          </ControlButton>

          <ControlButton
            label={isRaised ? t('lowerHand') : t('raiseHand')}
            onClick={onToggleHand}
            active={isRaised}
          >
            <Hand className="w-4 h-4" />
          </ControlButton>

          <div className="w-px h-5 bg-border mx-1" />

          <ControlButton label={t('leaveCall')} onClick={onLeave} destructive>
            <PhoneOff className="w-4 h-4" />
          </ControlButton>
        </div>
      </div>
    </div>
  )
}
