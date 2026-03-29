import { useState } from 'react'
import { Landing } from '@/pages/Landing/Landing'
import { Viewer } from '@/pages/Viewer/Viewer'

interface Session {
  name: string
  roomName: string
}

function App() {
  const [session, setSession] = useState<Session | null>(null)

  return session
    ? <Viewer name={session.name} roomName={session.roomName} onLeave={() => setSession(null)} />
    : <Landing onSubmit={(name, roomName) => setSession({ name, roomName })} />
}

export default App
