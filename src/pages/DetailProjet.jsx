import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import useAuth from '../hooks/useAuth.js'
import FormulaireTache from '../components/FormulaireTache.jsx'
import FormulaireModificationTache
  from '../components/FormulaireModificationTache.jsx'

function DetailProjet() {
  const { id } = useParams()
  const { utilisateur } = useAuth()

  const [projet, setProjet] = useState(null)
  const [taches, setTaches] = useState([])
  const [tacheEnEdition, setTacheEnEdition] =
  useState(null)
  const [chargement, setChargement] = useState(true)
  const [erreur, setErreur] = useState('')

  const gererTacheCreee = (tacheCreee) => {
    setTaches((tachesActuelles) => [
      ...tachesActuelles,
      tacheCreee,
    ])
  }

    const gererTacheModifiee = (tacheModifiee) => {
      setTaches((tachesActuelles) =>
        tachesActuelles.map((tache) =>
          tache.id === tacheModifiee.id
            ? tacheModifiee
            : tache,
        ),
      )

      setTacheEnEdition(null)
    }
  

  useEffect(() => {
    const chargerProjet = async () => {
      try {
        setChargement(true)
        setErreur('')

        const reponseProjet = await fetch(
          `http://localhost:3000/projets/${id}`,
        )

        if (!reponseProjet.ok) {
          throw new Error('Projet introuvable')
        }

        const donneesProjet = await reponseProjet.json()

        if (donneesProjet.utilisateurId !== utilisateur.id) {
          setErreur(
            'Vous ne pouvez pas accéder à ce projet.',
          )
          return
        }

        setProjet(donneesProjet)

        const reponseTaches = await fetch(
          `http://localhost:3000/taches?projetId=${id}`,
        )

        if (!reponseTaches.ok) {
          throw new Error(
            'Erreur lors du chargement des tâches',
          )
        }

        const donneesTaches = await reponseTaches.json()

        setTaches(donneesTaches)

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

        <FormulaireTache
          projetId={id}
          onTacheCreee={gererTacheCreee}
        />

        {tacheEnEdition && (
          <FormulaireModificationTache
            key={tacheEnEdition.id}
            tache={tacheEnEdition}
            onTacheModifiee={gererTacheModifiee}
            onAnnuler={() => setTacheEnEdition(null)}
          />
        )}

        {taches.length === 0 ? (
          <p>Aucune tâche pour ce projet.</p>
        ) : (
          <div>
            {taches.map((tache) => (
              <article key={tache.id}>
                <h3>{tache.titre}</h3>

                <p>{tache.description}</p>

                <p>
                  <strong>Statut :</strong>{' '}
                  {tache.statut}
                </p>

                <p>
                  <strong>Priorité :</strong>{' '}
                  {tache.priorite}
                </p>

                <p>
                  <strong>Échéance :</strong>{' '}
                  {tache.echeance}
                </p>

                <button
                  type="button"
                  onClick={() => setTacheEnEdition(tache)}
                >
                  Modifier
                </button>
              </article>
            ))}
          </div>
        )}
      </section>

    </main>
  )
}

export default DetailProjet