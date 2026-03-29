import { useEffect, useRef } from 'react'
import { useTranslations } from 'use-intl'
import type { LocalParticipant, RemoteParticipant } from 'twilio-video'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { TooltipProvider } from '@/components/ui/tooltip'
import { useRoom } from '@/hooks/useRoom/useRoom'
import { useLocalTracks } from '@/hooks/useLocalTracks/useLocalTracks'
import { useParticipants } from '@/hooks/useParticipants/useParticipants'
import { useDominantSpeaker } from '@/hooks/useDominantSpeaker/useDominantSpeaker'
import { useHandRaise } from '@/hooks/useHandRaise/useHandRaise'
import { useBackgroundBlur } from '@/hooks/useBackgroundBlur/useBackgroundBlur'
import { TopBar } from '@/components/TopBar/TopBar'
import { LocalTile } from '@/components/LocalTile/LocalTile'
import { RemoteTile } from '@/components/RemoteTile/RemoteTile'
import { RemoteAudio } from '@/components/RemoteAudio/RemoteAudio'
import { generateTwilioToken } from '@/lib/twilioToken'

interface Props {
  name: string
  roomName: string
  onLeave: () => void
}

export function Viewer({ name, roomName, onLeave }: Props) {
  const t = useTranslations('Viewer')
  const { localTracks, videoTrack, dataTrack, isAudioMuted, isVideoOff, isAcquiring, toggleAudio, toggleVideo } = useLocalTracks()
  const { room, state, error, connect, disconnect } = useRoom()
  const remoteParticipants = useParticipants(room)
  const dominantSpeaker = useDominantSpeaker(room)
  const { raisedHands, isRaised, toggleHand } = useHandRaise(room, dataTrack)
  const { isBlurred, toggleBlur } = useBackgroundBlur(videoTrack)

  const localTracksRef = useRef(localTracks)
  // Sync on every render so the connect effect always sees the latest tracks without
  // needing localTracks in its dependency array (which would cause reconnects on toggle).
  useEffect(() => {
    localTracksRef.current = localTracks
  })

  useEffect(() => {
    if (isAcquiring) return
    let cancelled = false
    generateTwilioToken(name, roomName)
      .then(token => { if (!cancelled) return connect(token, roomName, localTracksRef.current) })
      .catch(console.error)
    return () => {
      cancelled = true
      disconnect()
    }
  }, [name, connect, disconnect, isAcquiring])

  function handleLeave() {
    disconnect()
    onLeave()
  }

  const localParticipant = room?.localParticipant ?? null

  const mainParticipant: LocalParticipant | RemoteParticipant | null =
    dominantSpeaker ?? remoteParticipants[0] ?? localParticipant

  const thumbParticipants: (LocalParticipant | RemoteParticipant)[] = [
    ...(localParticipant && localParticipant.sid !== mainParticipant?.sid ? [localParticipant] : []),
    ...remoteParticipants.filter(p => p.sid !== mainParticipant?.sid),
  ]

  if (state !== 'connected' && state !== 'reconnecting') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground text-sm">
          {isAcquiring ? t('preparingCamera') : t('connecting')}
        </p>
      </div>
    )
  }

  return (
    <TooltipProvider delayDuration={300}>
      <div className="min-h-screen bg-background flex flex-col">
        <TopBar
          roomName={roomName}
          state={state}
          isAudioMuted={isAudioMuted}
          isVideoOff={isVideoOff}
          isBlurred={isBlurred}
          isRaised={isRaised}
          onToggleAudio={toggleAudio}
          onToggleVideo={toggleVideo}
          onToggleBlur={toggleBlur}
          onToggleHand={toggleHand}
          onLeave={handleLeave}
        />

        <div className="flex flex-col items-center px-4 py-4">
          <div className="w-full max-w-4xl flex flex-col gap-3">

            <div className="flex justify-center">
              {mainParticipant && (
                mainParticipant.sid === localParticipant?.sid ? (
                  <LocalTile
                    participant={mainParticipant}
                    videoTrack={videoTrack}
                    isAudioMuted={isAudioMuted}
                    isVideoOff={isVideoOff}
                    isHandRaised={isRaised}
                    size="main"
                  />
                ) : (
                  <RemoteTile participant={mainParticipant as RemoteParticipant} isHandRaised={raisedHands.has(mainParticipant.sid)} size="main" />
                )
              )}
            </div>

            {remoteParticipants.map(p => <RemoteAudio key={p.sid} participant={p} />)}

            <div className="flex items-start gap-2 overflow-x-auto pb-1">
              {thumbParticipants.map(p =>
                p.sid === localParticipant?.sid ? (
                  <LocalTile
                    key="local"
                    participant={p}
                    videoTrack={videoTrack}
                    isAudioMuted={isAudioMuted}
                    isVideoOff={isVideoOff}
                    isHandRaised={isRaised}
                    size="thumb"
                  />
                ) : (
                  <RemoteTile key={p.sid} participant={p as RemoteParticipant} isHandRaised={raisedHands.has(p.sid)} size="thumb" />
                )
              )}
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error.message}</AlertDescription>
              </Alert>
            )}
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}
