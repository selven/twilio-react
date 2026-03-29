import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { IntlProvider } from 'use-intl'
import './index.css'
import App from './App.tsx'
import messages from './messages/en.json'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <IntlProvider locale="en" messages={messages}>
      <App />
    </IntlProvider>
  </StrictMode>,
)
