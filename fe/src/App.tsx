import { BrowserRouter } from 'react-router-dom'
import { AppRoutes } from './router'
import { AuthProvider } from './context/AuthContext'


function App() {
  return (
    <BrowserRouter basename={__BASE_PATH__}>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App