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
      </div>

      <div className="sidebar-user">
        <span>Connecté en tant que </span>

        <strong>
          {utilisateur
            ? utilisateur.nom
            : 'Utilisateur'}
        </strong>
      </div>

      <nav
        className="sidebar-nav"
        aria-label="Navigation principale"
      >
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            isActive ? 'active' : ''
          }
        >
          Tableau de bord
        </NavLink>

        <NavLink
          to="/projets"
          className={({ isActive }) =>
            isActive ? 'active' : ''
          }
        >
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