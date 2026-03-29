import { useRef, useSyncExternalStore } from 'react'
import type { RemoteParticipant, RemoteTrackPublication } from 'twilio-video'

export function usePublications(participant: RemoteParticipant | null) {
  const cacheRef = useRef<RemoteTrackPublication[]>([])

  return useSyncExternalStore(
    (callback) => {
      if (!participant) return () => {}
      participant.on('trackPublished', callback)
      participant.on('trackUnpublished', callback)
      return () => {
        participant.off('trackPublished', callback)
        participant.off('trackUnpublished', callback)
      }
    },
    () => {
      const next = participant ? Array.from(participant.tracks.values()) : []
      const prev = cacheRef.current
      if (next.length === prev.length && next.every((t, i) => t === prev[i])) {
        return prev
      }
      cacheRef.current = next
      return next
    }
  )
}
