import { useEffect, useRef, useState } from 'react'
import { GaussianBlurBackgroundProcessor } from '@twilio/video-processors'
import type { LocalVideoTrack } from 'twilio-video'

const ASSETS_PATH = '/twilio-assets'

export function useBackgroundBlur(videoTrack: LocalVideoTrack | null) {
  const [isBlurred, setIsBlurred] = useState(false)
  const processorRef = useRef<GaussianBlurBackgroundProcessor | null>(null)
  const loadPromiseRef = useRef<Promise<void> | null>(null)
  const attachedRef = useRef(false)

  useEffect(() => {
    if (!videoTrack || !isBlurred) return

    let cancelled = false

    async function apply() {
      if (!processorRef.current) {
        processorRef.current = new GaussianBlurBackgroundProcessor({
          assetsPath: ASSETS_PATH,
          blurFilterRadius: 15,
          useWebWorker: false,
        })
        loadPromiseRef.current = processorRef.current.loadModel()
      }
      // Always await the same promise — concurrent calls share it
      const loadPromise = loadPromiseRef.current
      if (!loadPromise) return
      await loadPromise

      if (cancelled || !videoTrack) return

      videoTrack.addProcessor(processorRef.current!, {
        inputFrameBufferType: 'video',
        outputFrameBufferContextType: '2d',
      })
      attachedRef.current = true
    }

    apply().catch(console.error)

    return () => {
      cancelled = true
      if (attachedRef.current && processorRef.current) {
        videoTrack.removeProcessor(processorRef.current)
        attachedRef.current = false
      }
    }
  }, [isBlurred, videoTrack])

  const toggleBlur = () => setIsBlurred(prev => !prev)

  return { isBlurred, toggleBlur }
}
