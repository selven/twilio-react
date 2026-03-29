import { useSyncExternalStore } from 'react'
import type { RemoteTrackPublication } from 'twilio-video'

export function usePublicationIsEnabled(publication: RemoteTrackPublication | null): boolean {
  return useSyncExternalStore(
    (callback) => {
      if (!publication) return () => {}
      publication.on('trackEnabled', callback)
      publication.on('trackDisabled', callback)
      return () => {
        publication.off('trackEnabled', callback)
        publication.off('trackDisabled', callback)
      }
    },
    () => publication?.isTrackEnabled ?? true
  )
}
