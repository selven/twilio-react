import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'

interface Props {
  label: string
  onClick: () => void
  active?: boolean
  destructive?: boolean
  children: React.ReactNode
}

export function ControlButton({ label, onClick, active, destructive, children }: Props) {
  return (
    <Tooltip>
      <TooltipTrigger
        onClick={onClick}
        aria-label={label}
        className={cn(
          'inline-flex items-center justify-center rounded-xl w-9 h-9 cursor-pointer hover:bg-accent hover:text-accent-foreground transition-colors',
          active && 'bg-destructive/10 text-destructive hover:bg-destructive/20 hover:text-destructive',
          destructive && 'bg-destructive hover:bg-destructive/90 text-destructive-foreground'
        )}
      >
        {children}
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  )
}
