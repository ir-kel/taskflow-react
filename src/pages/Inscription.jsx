import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import useAuth from '../hooks/useAuth.js'

function Inscription() {
  const [nom, setNom] = useState('')
  const [email, setEmail] = useState('')
  const [motDePasse, setMotDePasse] = useState('')
  const [erreur, setErreur] = useState('')
  const [chargement, setChargement] = useState(false)

  const navigate = useNavigate()
  const { connecter } = useAuth()

  const gererInscription = async (event) => {
    event.preventDefault()

    setErreur('')
    setChargement(true)

    try {
      const reponseVerification = await fetch(
        `http://localhost:3000/utilisateurs?email=${encodeURIComponent(email)}`,
      )

      if (!reponseVerification.ok) {
        throw new Error(
          'Erreur lors de la vérification de l’e-mail',
        )
      }

      const utilisateursExistants =
        await reponseVerification.json()

      if (utilisateursExistants.length > 0) {
        setErreur('Un compte existe déjà avec cet e-mail.')
        return
      }

      const reponseCreation = await fetch(
        'http://localhost:3000/utilisateurs',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            nom,
            email,
            motDePasse,
          }),
        },
      )

      if (!reponseCreation.ok) {
        throw new Error(
          'Erreur lors de la création du compte',
        )
      }

      const nouvelUtilisateur = await reponseCreation.json()

      connecter(nouvelUtilisateur)
      navigate('/dashboard')
    } catch (error) {
      console.error(error)
      setErreur('Impossible de créer le compte.')
    } finally {
      setChargement(false)
    }
  }

  return (
    <main>
      <h1>Inscription</h1>

      <form onSubmit={gererInscription}>
        <div>
          <label htmlFor="nom">Nom</label>

          <input
            id="nom"
            type="text"
            value={nom}
            onChange={(event) => setNom(event.target.value)}
            required
          />
        </div>

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
          <label htmlFor="motDePasse">
            Mot de passe
          </label>

          <input
            id="motDePasse"
            type="password"
            value={motDePasse}
            onChange={(event) =>
              setMotDePasse(event.target.value)
            }
            required
          />
        </div>

        {erreur && <p>{erreur}</p>}

        <button
          type="submit"
          disabled={chargement}
        >
          {chargement
            ? 'Création du compte...'
            : 'Créer mon compte'}
        </button>
      </form>

      <p>
        Déjà inscrit ?{' '}
        <Link to="/connexion">
          Se connecter
        </Link>
      </p>
    </main>
  )
}

export default Inscription