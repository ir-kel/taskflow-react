import { NavLink } from 'react-router-dom'

function BarreLaterale() {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <h1>TaskFlow</h1>
        <p>Gestion de projets</p>
      </div>

      <nav className="sidebar-nav">
        <NavLink to="/dashboard">
          Tableau de bord
        </NavLink>

        <NavLink to="/projets">
          Mes projets
        </NavLink>
      </nav>
    </aside>
  )
}

export default BarreLaterale