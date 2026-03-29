import { useState } from 'react'
import { useTranslations } from 'use-intl'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface Props {
  onSubmit: (name: string) => void
}

export function Landing({ onSubmit }: Props) {
  const t = useTranslations('Landing')
  const [name, setName] = useState('')

  const canSubmit = name.length >= 2

  function handleSubmit() {
    if (canSubmit) onSubmit(name.trim())
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-8">
        <div className="bg-card border border-border rounded-xl p-6 shadow-xs space-y-4">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            {t('title')}
          </h1>
          <div className="space-y-1.5">
            <Label htmlFor="name">{t('nameLabel')}</Label>
            <Input
              id="name"
              value={name}
              onChange={e => setName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSubmit()}
              className="h-11"
            />
          </div>

          <div className="flex justify-end">
            <Button onClick={handleSubmit} disabled={!canSubmit}>
              {t('join')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
