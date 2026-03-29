import { useCallback, useEffect, useState } from 'react'
import type { LocalDataTrack, RemoteDataTrack, RemoteParticipant, RemoteTrack, Room } from 'twilio-video'

export function useHandRaise(room: Room | null, dataTrack: LocalDataTrack) {
  const [raisedHands, setRaisedHands] = useState<Set<string>>(new Set())

  const localSid = room?.localParticipant.sid
  const isRaised = localSid ? raisedHands.has(localSid) : false

  const toggleHand = useCallback(() => {
    if (!room) return
    const next = !isRaised
    dataTrack.send(JSON.stringify({ type: 'hand', raised: next }))
    setRaisedHands(prev => {
      const updated = new Set(prev)
      if (next) updated.add(room.localParticipant.sid)
      else updated.delete(room.localParticipant.sid)
      return updated
    })
  }, [room, dataTrack, isRaised])

  useEffect(() => {
    if (!room) return

    const trackCleanups: Array<() => void> = []

    function attachTrack(track: RemoteDataTrack, participant: RemoteParticipant) {
      const handler = (data: string) => {
        let msg: { type: string; raised: boolean }
        try { msg = JSON.parse(data) } catch { return }
        if (msg.type !== 'hand') return
        setRaisedHands(prev => {
          const updated = new Set(prev)
          if (msg.raised) updated.add(participant.sid)
          else updated.delete(participant.sid)
          return updated
        })
      }
      track.on('message', handler)
      trackCleanups.push(() => track.off('message', handler))
    }

    function onTrackSubscribed(track: RemoteTrack, _: unknown, participant: RemoteParticipant) {
      if (track.kind === 'data') attachTrack(track as RemoteDataTrack, participant)
    }

    function onParticipantDisconnected(participant: RemoteParticipant) {
      setRaisedHands(prev => {
        const updated = new Set(prev)
        updated.delete(participant.sid)
        return updated
      })
    }

    // Attach to already-subscribed data tracks
    room.participants.forEach(participant => {
      participant.tracks.forEach(publication => {
        if (publication.kind === 'data' && publication.track) {
          attachTrack(publication.track as RemoteDataTrack, participant)
        }
      })
    })

    room.on('trackSubscribed', onTrackSubscribed)
    room.on('participantDisconnected', onParticipantDisconnected)
    return () => {
      trackCleanups.forEach(c => c())
      room.off('trackSubscribed', onTrackSubscribed)
      room.off('participantDisconnected', onParticipantDisconnected)
    }
  }, [room])

  return { raisedHands, isRaised, toggleHand }
}
