import { Navigate, Outlet } from 'react-router-dom'
import useAuth from '../hooks/useAuth.js'

function RoutePrivee() {
  const { utilisateur } = useAuth()

  if (!utilisateur) {
    return <Navigate to="/connexion" replace />
  }

  return <Outlet />
}

export default RoutePrivee