import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { GlobalStateProvider } from './context/GlobalStateContext.tsx'

import { ErrorBoundary } from './components/ErrorBoundary.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <GlobalStateProvider>
        <App />
      </GlobalStateProvider>
    </ErrorBoundary>
  </StrictMode>,
)
