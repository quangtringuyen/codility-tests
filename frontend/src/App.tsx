import { Routes, Route } from 'react-router-dom'
import { Toaster } from 'sonner'
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
      </Routes>
      <Toaster position="top-right" richColors />
    </>
  )
}

export default App
