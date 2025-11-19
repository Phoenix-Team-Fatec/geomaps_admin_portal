import './App.css'
import { Routes, Route } from 'react-router'
import UserPage from './pages/user/user'
import OcorrenciaPage from './pages/ocorrencia/ocorrencia'
import Login from './pages/login/login'
import PrivateAdminRoute from './middlewares/private_layout'


function App() {

  return (
    <>
     <Routes>
        
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />

        <Route path="/users" element={
            <PrivateAdminRoute>
                <UserPage />
                </PrivateAdminRoute>
              } />
              
        <Route path="/ocorrencias" element={
            <PrivateAdminRoute>
                <OcorrenciaPage />
                </PrivateAdminRoute>
              } />
     
     </Routes>
    </>
  )
}

export default App
