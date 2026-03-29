import { useCallback, useEffect, useMemo, useState } from 'react'
import Video, { LocalAudioTrack, LocalDataTrack, LocalVideoTrack } from 'twilio-video'

export function useLocalTracks() {
  const [audioTrack, setAudioTrack] = useState<LocalAudioTrack | null>(null)
  const [videoTrack, setVideoTrack] = useState<LocalVideoTrack | null>(null)
  const [dataTrack] = useState<LocalDataTrack>(() => new LocalDataTrack())
  const [isAudioMuted, setIsAudioMuted] = useState(false)
  const [isVideoOff, setIsVideoOff] = useState(false)
  const [isAcquiring, setIsAcquiring] = useState(true)

  useEffect(() => {
    let audio: LocalAudioTrack | null = null
    let video: LocalVideoTrack | null = null
    let unmounted = false

    async function acquire() {
      try {
        audio = await Video.createLocalAudioTrack()
        if (!unmounted) setAudioTrack(audio)
        else audio.stop()
      } catch (err) {
        console.warn('Could not acquire audio:', err)
      }
      try {
        video = await Video.createLocalVideoTrack()
        if (!unmounted) setVideoTrack(video)
        else video.stop()
      } catch (err) {
        console.warn('Could not acquire video:', err)
      }
      if (!unmounted) setIsAcquiring(false)
    }

    acquire()

    return () => {
      unmounted = true
      audio?.stop()
      video?.stop()
      setAudioTrack(null)
      setVideoTrack(null)
      setIsAcquiring(true)
    }
  }, [])

  const toggleAudio = useCallback(() => {
    if (!audioTrack) return
    setIsAudioMuted(prev => {
      if (prev) audioTrack.enable()
      else audioTrack.disable()
      return !prev
    })
  }, [audioTrack])

  const toggleVideo = useCallback(() => {
    if (!videoTrack) return
    setIsVideoOff(prev => {
      if (prev) videoTrack.enable()
      else videoTrack.disable()
      return !prev
    })
  }, [videoTrack])

  const localTracks = useMemo(() => [
    ...(audioTrack ? [audioTrack] : []),
    ...(videoTrack ? [videoTrack] : []),
    dataTrack,
  ] as (LocalAudioTrack | LocalVideoTrack | LocalDataTrack)[], [audioTrack, videoTrack, dataTrack])

  return { localTracks, audioTrack, videoTrack, dataTrack, isAudioMuted, isVideoOff, isAcquiring, toggleAudio, toggleVideo }
}
