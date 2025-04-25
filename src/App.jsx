import './App.css'
import {BrowserRouter as RouterLayer , Routes , Route, Navigate } from 'react-router-dom'
import LoginPage from './pages/Login'
import SignUpPage from './pages/SignUp'
import TasksManagement from './pages/Task_Management'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './component/ProtectedRoute'

function App() {
  return (
    <AuthProvider>
      <RouterLayer>
        <Routes>
          <Route path='/' element={<LoginPage/>}/>
          <Route path='/sign-up' element={<SignUpPage/>}/>
          <Route 
            path='/home' 
            element={
              <ProtectedRoute>
                <TasksManagement/>
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </RouterLayer>
    </AuthProvider>
  )
}

export default App
