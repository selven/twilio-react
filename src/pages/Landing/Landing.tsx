import { useState } from 'react'
import { useTranslations } from 'use-intl'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface Props {
  onSubmit: (name: string, roomName: string) => void
}

export function Landing({ onSubmit }: Props) {
  const t = useTranslations('Landing')
  const [name, setName] = useState('')
  const [roomName, setRoomName] = useState('')

  const canSubmit = name.trim().length >= 2 && roomName.trim().length >= 2

  function handleSubmit() {
    if (canSubmit) onSubmit(name.trim(), roomName.trim())
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">{t('title')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
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
          <div className="space-y-1.5">
            <Label htmlFor="room">{t('roomLabel')}</Label>
            <Input
              id="room"
              value={roomName}
              onChange={e => setRoomName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSubmit()}
              className="h-11"
            />
          </div>
        </CardContent>
        <CardFooter className="justify-end">
          <Button onClick={handleSubmit} disabled={!canSubmit}>
            {t('join')}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
