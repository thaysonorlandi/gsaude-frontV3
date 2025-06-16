import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Router from './routes'
import { RouterProvider } from 'react-router-dom'
import { UserProvider } from './contexts/contexts'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <UserProvider>
      <RouterProvider router={Router} />
    </UserProvider>
  </StrictMode>,
)
