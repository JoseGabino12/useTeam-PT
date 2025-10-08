import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { router } from './app/App.tsx'
import { RouterProvider } from 'react-router'
import { Toaster } from './components/ui/sonner.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={ router } />
    <Toaster />
  </StrictMode>,
)
