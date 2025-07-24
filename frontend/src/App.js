import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import LoginForm from './components/LoginForm'
import PaymentForm from './components/PaymentForm'
import PaymentList from './components/PaymentList'
import PaymentDetail from './components/PaymentDetail'
import Navbar from './components/Navbar'

const App = () => {
  const isAuthenticated = !!localStorage.getItem('access_token')

  return (
    <Router>
      {isAuthenticated && <Navbar />}
      
      <div className={isAuthenticated ? "pt-16" : ""}>
        <Routes>
          <Route 
            path="/login" 
            element={isAuthenticated ? <Navigate to="/payments" /> : <LoginForm />} 
          />
          <Route 
            path="/payments/new" 
            element={isAuthenticated ? <PaymentForm /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/payments/:id" 
            element={isAuthenticated ? <PaymentDetail /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/payments" 
            element={isAuthenticated ? <PaymentList /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/" 
            element={<Navigate to={isAuthenticated ? "/payments" : "/login"} />} 
          />
        </Routes>
      </div>
    </Router>
  )
}

export default App