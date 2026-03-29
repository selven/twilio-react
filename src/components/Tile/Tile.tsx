import { Hand, MicOff } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'

interface Props {
  name: string
  label?: string
  isMuted?: boolean
  isHandRaised?: boolean
  size: 'main' | 'thumb'
  children: React.ReactNode
}

export function Tile({ name, label, isMuted, isHandRaised, size, children }: Props) {
  return (
    <div
      className={cn(
        'relative bg-card rounded-2xl overflow-hidden flex-shrink-0 border border-border shadow-sm',
        size === 'main' ? 'w-full max-w-4xl aspect-video' : 'w-40 aspect-video'
      )}
    >
      {children ?? (
        <div className="absolute inset-0 flex items-center justify-center">
          <Avatar className="w-16 h-16">
            <AvatarFallback className="bg-muted text-muted-foreground text-2xl font-medium">
              {name[0]?.toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>
      )}
      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-2">
        <span className="text-xs font-medium text-white bg-black/50 backdrop-blur-sm px-2.5 py-1 rounded-lg truncate max-w-[80%]">
          {name}{label ? ` (${label})` : ''}
        </span>
        {isHandRaised && (
          <span className="bg-amber-400/90 backdrop-blur-sm p-1 rounded-lg flex-shrink-0">
            <Hand className="w-3 h-3 text-amber-900" />
          </span>
        )}
        {isMuted && (
          <span className="bg-black/50 backdrop-blur-sm p-1 rounded-lg flex-shrink-0">
            <MicOff className="w-3 h-3 text-red-400" />
          </span>
        )}
      </div>
    </div>
  )
}
