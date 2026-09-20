import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import useAuth from '../hooks/useAuth.js'

function Connexion() {
  const [email, setEmail] = useState('')
  const [motDePasse, setMotDePasse] = useState('')
  const [erreur, setErreur] = useState('')
  const [chargement, setChargement] = useState(false)

  const navigate = useNavigate()
  const { connecter } = useAuth()

  const gererConnexion = async (event) => {
    event.preventDefault()

    setErreur('')
    setChargement(true)

    try {
      const reponse = await fetch(
        `http://localhost:3000/utilisateurs?email=${encodeURIComponent(email)}`,
      )

      if (!reponse.ok) {
        throw new Error('Erreur lors de la connexion')
      }

      const utilisateurs = await reponse.json()
      const utilisateur = utilisateurs[0]

      if (!utilisateur || utilisateur.motDePasse !== motDePasse) {
        setErreur('E-mail ou mot de passe incorrect.')
        return
      }

      connecter(utilisateur)
      navigate('/dashboard')
    } catch (error) {
      console.error(error)
      setErreur('Impossible de se connecter au serveur.')
    } finally {
      setChargement(false)
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-visual">
        <div className="auth-visual-content">
          <h1>TaskFlow</h1>

          <p>
            Organisez vos projets, gérez vos tâches
            et suivez votre progression depuis un
            espace simple et centralisé.
          </p>
        </div>
      </section>

      <section className="auth-form-side">
        <div className="auth-card">
          <header className="auth-card-header">
            <h2>Connexion</h2>

            <p>
              Connectez-vous pour accéder à vos
              projets et à votre tableau de bord.
            </p>
          </header>

        
          <form
            className="app-form"
            onSubmit={gererConnexion}
          >
            <div className="form-group">
              <label htmlFor="emailConnexion">
                Adresse e-mail
              </label>

              <input
                id="emailConnexion"
                className="form-control"
                type="email"
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
                placeholder="vous@exemple.com"
                autoComplete="email"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="motDePasseConnexion">
                Mot de passe
              </label>

              <input
                id="motDePasseConnexion"
                className="form-control"
                type="password"
                value={motDePasse}
                onChange={(event) =>
                  setMotDePasse(event.target.value)
                }
                autoComplete="current-password"
                required
              />
            </div>

            {erreur && (
              <p className="form-error">
                {erreur}
              </p>
            )}

            <button
              className="button button-primary auth-submit"
              type="submit"
              disabled={chargement}
            >
              {chargement
                ? 'Connexion...'
                : 'Se connecter'}
            </button>
          </form>

          <p className="auth-footer">
            Pas encore de compte ?{' '}
            <Link to="/inscription">
              Créer un compte
            </Link>
          </p>
        </div>
      </section>
    </main>
  )
}

export default Connexion