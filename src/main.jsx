import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import Layout from '@/layout.jsx'
import './index.css'

// Import pages
import HomePage from '../home.jsx'
import LoginPage from './pages/Login'
import RegisterPage from './pages/Register'
import DashboardPage from '../dashboard.jsx'
import MyCertificatesPage from '../MyCertificate.jsx'
import VerifyPage from '../Verify.jsx'
import IssueCertificatePage from '../IssueCertificate'
import { AuthProvider } from './contexts/AuthContext'
import { ProtectedRoute } from './components/ProtectedRoute'

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <Layout>
            <Routes>
              <Route
                path="/"
                element={
                  <ProtectedRoute allowedRoles={["institute"]}>
                    <HomePage />
                  </ProtectedRoute>
                }
              />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/verify" element={<VerifyPage />} />
              
              {/* Protected Routes for Institute Users */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['institute']}>
                    <DashboardPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/my-certificates"
                element={
                  <ProtectedRoute allowedRoles={['institute', 'student']}>
                    <MyCertificatesPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/issue"
                element={
                  <ProtectedRoute allowedRoles={['institute']}>
                    <IssueCertificatePage />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </Layout>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  )
}

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
