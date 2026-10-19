import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// Auto-clean legacy redirect path (/soc-dashboard-finale/login.php) from address bar instantly
if (typeof window !== 'undefined') {
  const currentPath = window.location.pathname;
  if (currentPath.includes('login.php')) {
    window.history.replaceState(null, '', '/');
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
