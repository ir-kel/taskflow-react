import { Link } from 'react-router-dom'

function NonTrouve() {
  return (
    <main className="not-found-page">
      <div className="not-found-card">
        <p className="not-found-code">
          404
        </p>

        <h1>Page introuvable</h1>

        <p>
          La page que vous recherchez n'existe pas
          ou a peut-être été déplacée.
        </p>

        <Link
          to="/dashboard"
          className="button button-primary"
        >
          Retour au tableau de bord
        </Link>
      </div>
    </main>
  )
}

export default NonTrouve