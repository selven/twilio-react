import React from 'react'
import { render, type RenderOptions } from '@testing-library/react'
import { IntlProvider } from 'use-intl'
import messages from '../messages/en.json'

function Providers({ children }: { children: React.ReactNode }) {
  return React.createElement(IntlProvider, { locale: 'en', messages }, children)
}

function customRender(ui: React.ReactElement, options?: RenderOptions) {
  return render(ui, { wrapper: Providers, ...options })
}

export * from '@testing-library/react'
export { customRender as render }
