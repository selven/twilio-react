import { useState } from 'react'
import { Landing } from '@/pages/Landing/Landing'
import { Viewer } from '@/pages/Viewer/Viewer'

function App() {
  const [name, setName] = useState<string | null>(null)

  return name
    ? <Viewer name={name} onLeave={() => setName(null)} />
    : <Landing onSubmit={setName} />
}

export default App
