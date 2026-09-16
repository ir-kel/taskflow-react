import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import useAuth from '../hooks/useAuth.js'

function DetailProjet() {
  const { id } = useParams()
  const { utilisateur } = useAuth()

  const [projet, setProjet] = useState(null)
  const [chargement, setChargement] = useState(true)
  const [erreur, setErreur] = useState('')

  useEffect(() => {
    const chargerProjet = async () => {
      try {
        setChargement(true)
        setErreur('')

        const reponse = await fetch(
          `http://localhost:3000/projets/${id}`,
        )

        if (!reponse.ok) {
          throw new Error('Projet introuvable')
        }

        const donnees = await reponse.json()

        if (donnees.utilisateurId !== utilisateur.id) {
          setErreur(
            'Vous ne pouvez pas accéder à ce projet.',
          )
          return
        }

        setProjet(donnees)
      } catch (error) {
        console.error(error)
        setErreur('Impossible de charger ce projet.')
      } finally {
        setChargement(false)
      }
    }

    chargerProjet()
  }, [id, utilisateur.id])

  if (chargement) {
    return (
      <main>
        <p>Chargement du projet...</p>
      </main>
    )
  }

  if (erreur) {
    return (
      <main>
        <h1>Projet indisponible</h1>
        <p>{erreur}</p>

        <Link to="/projets">
          Retour aux projets
        </Link>
      </main>
    )
  }

  return (
    <main>
      <Link to="/projets">
        ← Retour aux projets
      </Link>

      <h1>{projet.nom}</h1>

      <p>{projet.description}</p>

      <p>
        <strong>Date de création :</strong>{' '}
        {projet.creeLe}
      </p>

      <div>
        <strong>Couleur :</strong>{' '}

        <span
          style={{
            display: 'inline-block',
            width: '20px',
            height: '20px',
            backgroundColor: projet.couleur,
            verticalAlign: 'middle',
          }}
        />
      </div>

      <section>
        <h2>Tâches du projet</h2>
        <p>
          Les tâches de ce projet seront affichées ici.
        </p>
      </section>
    </main>
  )
}

export default DetailProjet