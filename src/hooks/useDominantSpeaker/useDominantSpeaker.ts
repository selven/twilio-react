import { useEffect, useState } from 'react'
import type { RemoteParticipant, Room } from 'twilio-video'

export function useDominantSpeaker(room: Room | null) {
  const [dominantSpeaker, setDominantSpeaker] = useState<RemoteParticipant | null>(null)

  useEffect(() => {
    if (!room) return

    // Only update on a new speaker — ignore null so the last speaker stays large
    // between utterances rather than snapping back to the default.
    const onChanged = (speaker: RemoteParticipant | null) => {
      if (speaker) setDominantSpeaker(speaker)
    }

    // Clear if that participant leaves
    const onDisconnected = (participant: RemoteParticipant) => {
      setDominantSpeaker(prev => (prev?.sid === participant.sid ? null : prev))
    }

    room.on('dominantSpeakerChanged', onChanged)
    room.on('participantDisconnected', onDisconnected)
    return () => {
      room.off('dominantSpeakerChanged', onChanged)
      room.off('participantDisconnected', onDisconnected)
    }
  }, [room])

  return dominantSpeaker
}
