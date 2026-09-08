import { NavLink, useNavigate } from 'react-router-dom'
import useAuth from '../hooks/useAuth.js'

function BarreLaterale() {
  const { utilisateur, deconnecter } = useAuth()
  const navigate = useNavigate()

  const gererDeconnexion = () => {
    deconnecter()
    navigate('/connexion', { replace: true })
  }

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <h1>TaskFlow</h1>
        <p>Gestion de projets</p>

        <p>
          {utilisateur ? utilisateur.nom : 'Aucun utilisateur connecté'}
        </p>
      </div>

      <nav className="sidebar-nav">
        <NavLink to="/dashboard">
          Tableau de bord
        </NavLink>

        <NavLink to="/projets">
          Mes projets
        </NavLink>
      </nav>

      <div className="sidebar-footer">
        <button
          type="button"
          className="logout-button"
          onClick={gererDeconnexion}
        >
          Se déconnecter
        </button>
      </div>
    </aside>
  )
}

export default BarreLaterale