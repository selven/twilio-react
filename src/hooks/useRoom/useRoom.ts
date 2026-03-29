import { useCallback, useEffect, useRef, useState } from 'react'
import Video, { LocalAudioTrack, LocalDataTrack, LocalVideoTrack, Room } from 'twilio-video'

export type RoomState = 'disconnected' | 'connecting' | 'connected' | 'reconnecting'

export function useRoom() {
  const [room, setRoom] = useState<Room | null>(null)
  const [state, setState] = useState<RoomState>('disconnected')
  const [error, setError] = useState<Error | null>(null)
  const roomRef = useRef<Room | null>(null)
  const disconnectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const connect = useCallback(async (
    token: string,
    roomName: string,
    localTracks: (LocalAudioTrack | LocalVideoTrack | LocalDataTrack)[] = []
  ) => {
    if (roomRef.current) return
    setState('connecting')
    setError(null)
    try {
      const newRoom = await Video.connect(token, {
        name: roomName,
        tracks: localTracks,
        dominantSpeaker: true,
      })
      roomRef.current = newRoom
      setRoom(newRoom)
      setState('connected')

      const onReconnecting = () => setState('reconnecting')
      const onReconnected = () => setState('connected')
      const onDisconnected = () => {
        newRoom.off('reconnecting', onReconnecting)
        newRoom.off('reconnected', onReconnected)
        newRoom.off('disconnected', onDisconnected)
        window.removeEventListener('beforeunload', handleUnload)
        // Defer state clear one tick so Twilio finishes its own disconnect handling
        disconnectTimerRef.current = setTimeout(() => {
          disconnectTimerRef.current = null
          roomRef.current = null
          setRoom(null)
          setState('disconnected')
        })
      }
      const handleUnload = () => newRoom.disconnect()

      newRoom.on('reconnecting', onReconnecting)
      newRoom.on('reconnected', onReconnected)
      newRoom.on('disconnected', onDisconnected)
      window.addEventListener('beforeunload', handleUnload)
    } catch (err) {
      console.error('Twilio connect error:', JSON.stringify(err, Object.getOwnPropertyNames(err)))
      setError(err instanceof Error ? err : new Error(String(err)))
      setState('disconnected')
    }
  }, [])

  const disconnect = useCallback(() => {
    roomRef.current?.disconnect()
  }, [])

  useEffect(() => {
    return () => {
      if (disconnectTimerRef.current) clearTimeout(disconnectTimerRef.current)
      roomRef.current?.disconnect()
    }
  }, [])

  return { room, state, error, connect, disconnect }
}
