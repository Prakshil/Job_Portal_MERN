import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Toaster } from 'react-hot-toast'

// Add dark class to html element for dark theme
document.documentElement.classList.add('dark');

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
    <Toaster 
      position="top-right"
      toastOptions={{
        duration: 3000,
        style: {
          background: 'hsl(var(--card))',
          color: 'hsl(var(--card-foreground))',
          border: '1px solid hsl(var(--border))',
        },
        success: {
          iconTheme: {
            primary: '#10b981',
            secondary: 'white',
          },
        },
        error: {
          iconTheme: {
            primary: '#ef4444',
            secondary: 'white',
          },
        },
      }}
    />
  </StrictMode>,
)
