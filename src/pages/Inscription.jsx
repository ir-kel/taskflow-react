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
        // setErreur('Un compte existe déjà avec cet e-mail.')
        setErreur("Impossible de s'inscrir avec cette adresse mail, veuillez vous rassurez qu'elle est valide ou utiliser une autre")

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
    <main className="auth-page">
      <section className="auth-visual">
        <div className="auth-visual-content">
          <h1>TaskFlow</h1>

          <p>
            Créez votre espace personnel et commencez
            à organiser vos projets et vos tâches.
          </p>
        </div>
      </section>

      <section className="auth-form-side">
        <div className="auth-card">
          <header className="auth-card-header">
            <h2>Créer un compte</h2>

            <p>
              Quelques informations suffisent pour
              commencer à utiliser TaskFlow.
            </p>
          </header>

          <form
            className="app-form"
            onSubmit={gererInscription}
          >
          
            <div className="form-group">
              <label htmlFor="nomInscription">
                Nom
              </label>

              <input
                id="nomInscription"
                className="form-control"
                type="text"
                value={nom}
                onChange={(event) =>
                  setNom(event.target.value)
                }
                placeholder="Votre nom"
                autoComplete="name"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="emailInscription">
                Adresse e-mail
              </label>

              <input
                id="emailInscription"
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
              <label htmlFor="motDePasseInscription">
                Mot de passe
              </label>

              <input
                id="motDePasseInscription"
                className="form-control"
                type="password"
                value={motDePasse}
                onChange={(event) =>
                  setMotDePasse(event.target.value)
                }
                autoComplete="new-password"
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
                ? 'Création...'
                : 'Créer mon compte'}
            </button>
          </form>

          <p className="auth-footer">
            Vous avez déjà un compte ?{' '}
            <Link to="/connexion">
              Se connecter
            </Link>
          </p>
        </div>
      </section>
    </main>
  )
}

export default Inscription