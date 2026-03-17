
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

import { AppProvider } from './context/AppContext'
import { SettingsProvider } from './context/SettingsContext'
import { VocabProvider } from './context/VocabContext'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <SettingsProvider>
      <AppProvider>
        <VocabProvider>
          <App />
        </VocabProvider>
      </AppProvider>
    </SettingsProvider>
  </React.StrictMode>,
)