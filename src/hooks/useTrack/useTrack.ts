import { useSyncExternalStore } from 'react'
import type { RemoteTrackPublication, RemoteTrack } from 'twilio-video'

export function useTrack(publication: RemoteTrackPublication | null) {
  return useSyncExternalStore(
    (callback) => {
      if (!publication) return () => {}
      publication.on('subscribed', callback)
      publication.on('unsubscribed', callback)
      return () => {
        publication.off('subscribed', callback)
        publication.off('unsubscribed', callback)
      }
    },
    (): RemoteTrack | null => publication?.track ?? null
  )
}
