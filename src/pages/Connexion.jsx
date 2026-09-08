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
    <main>
      <h1>Connexion</h1>

      <form onSubmit={gererConnexion}>
        <div>
          <label htmlFor="email">E-mail</label>

          <input
            id="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="motDePasse">Mot de passe</label>

          <input
            id="motDePasse"
            type="password"
            value={motDePasse}
            onChange={(event) => setMotDePasse(event.target.value)}
            required
          />
        </div>

        {erreur && <p>{erreur}</p>}

        <button type="submit" disabled={chargement}>
          {chargement ? 'Connexion...' : 'Se connecter'}
        </button>

        <p>
          Pas encore de compte ?{' '}
          <Link to="/inscription">
            Créer un compte
          </Link>
        </p>
      </form>
    </main>
  )
}

export default Connexion