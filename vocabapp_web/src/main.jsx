
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

import { AppProvider } from './context/AppContext'
import { SettingsProvider } from './context/SettingsContext'
import { VocabProvider } from './context/VocabContext'

import { initStorage } from './utils/storage.js';
import { SplashScreen } from '@capacitor/splash-screen';

const startApp = async () => {
  await initStorage();

  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <SettingsProvider>
        <AppProvider>
          <VocabProvider>
            <App />
          </VocabProvider>
        </AppProvider>
      </SettingsProvider>
    </React.StrictMode>
  );

  try {
    await SplashScreen.hide();
  } catch (e) {
    // Ingore error in standard web environments where Splash Screen isn't available
  }
};

startApp();