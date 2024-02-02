import React from 'react'
import { createRoot } from 'react-dom/client'
import { Suspense } from 'react'
import './styles.css'
import { App } from './App'
import { PlayProvider } from './contexts/Play'
import { Overlay } from './Components/Overlay'
import 'boxicons/css/boxicons.min.css';


createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <PlayProvider>
      <Suspense fallback={null}>
        <App />
      </Suspense>
    
    <Overlay />
    </PlayProvider>
    {/* <Logo style={{ position: 'absolute', bottom: 40, left: 40, width: 30 }} /> */}
  </React.StrictMode>
)
