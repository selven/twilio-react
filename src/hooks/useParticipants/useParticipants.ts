import { useRef, useSyncExternalStore } from 'react'
import type { RemoteParticipant, Room } from 'twilio-video'

export function useParticipants(room: Room | null) {
  const cacheRef = useRef<RemoteParticipant[]>([])

  return useSyncExternalStore(
    (callback) => {
      if (!room) return () => {}
      room.on('participantConnected', callback)
      room.on('participantDisconnected', callback)
      return () => {
        room.off('participantConnected', callback)
        room.off('participantDisconnected', callback)
      }
    },
    () => {
      const next = room ? Array.from(room.participants.values()) : []
      const prev = cacheRef.current
      if (next.length === prev.length && next.every((p, i) => p === prev[i])) {
        return prev
      }
      cacheRef.current = next
      return next
    }
  )
}
