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

  const [recherche, setRecherche] = useState('')
  const [filtreStatut, setFiltreStatut] = useState('')
  const [filtrePriorite, setFiltrePriorite] = useState('')

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

    const gererChangementStatut = async (
      tache,
      nouveauStatut,
    ) => {
      const dateModification = new Date()
        .toISOString()
        .slice(0, 10)

      try {
        const reponse = await fetch(
          `http://localhost:3000/taches/${tache.id}`,
          {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              statut: nouveauStatut,
              modifieLe: dateModification,
            }),
          },
        )

        if (!reponse.ok) {
          throw new Error(
            'Erreur lors du changement de statut',
          )
        }

        const tacheModifiee = await reponse.json()

        setTaches((tachesActuelles) =>
          tachesActuelles.map((tacheActuelle) =>
            tacheActuelle.id === tacheModifiee.id
              ? tacheModifiee
              : tacheActuelle,
          ),
        )
      } catch (error) {
        console.error(error)
      }
    }

    const gererSuppressionTache = async (tache) => {
    const confirmation = window.confirm(
      `Voulez-vous vraiment supprimer la tâche "${tache.titre}" ?`,
    )

    if (!confirmation) {
      return
    }

    try {
      const reponse = await fetch(
        `http://localhost:3000/taches/${tache.id}`,
        {
          method: 'DELETE',
        },
      )

      if (!reponse.ok) {
        throw new Error(
          'Erreur lors de la suppression de la tâche',
        )
      }

      setTaches((tachesActuelles) =>
        tachesActuelles.filter(
          (tacheActuelle) =>
            tacheActuelle.id !== tache.id,
        ),
      )

      if (tacheEnEdition?.id === tache.id) {
        setTacheEnEdition(null)
      }
    } catch (error) {
      console.error(error)

      setErreur(
        'Impossible de supprimer la tâche.',
      )
    }
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

  const tachesFiltrees = taches.filter((tache) => {
    const texteRecherche = recherche
      .trim()
      .toLowerCase()

    const correspondRecherche =
      texteRecherche === '' ||
      tache.titre
        .toLowerCase()
        .includes(texteRecherche) ||
      (tache.description ?? '')
        .toLowerCase()
        .includes(texteRecherche)

    const correspondStatut =
      filtreStatut === '' ||
      tache.statut === filtreStatut

    const correspondPriorite =
      filtrePriorite === '' ||
      tache.priorite === filtrePriorite

    return (
      correspondRecherche &&
      correspondStatut &&
      correspondPriorite
    )
  })

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

      <div>
        <div>
          <label htmlFor="rechercheTache">
            Rechercher une tâche
          </label>

          <input
            id="rechercheTache"
            type="search"
            placeholder="Titre ou description..."
            value={recherche}
            onChange={(event) =>
              setRecherche(event.target.value)
            }
          />
        </div>

        <div>
          <label htmlFor="filtreStatut">
            Statut
          </label>

          <select
            id="filtreStatut"
            value={filtreStatut}
            onChange={(event) =>
              setFiltreStatut(event.target.value)
            }
          >
            <option value="">
              Tous les statuts
            </option>
            <option value="a_faire">
              À faire
            </option>
            <option value="en_cours">
              En cours
            </option>
            <option value="terminee">
              Terminée
            </option>
          </select>
        </div>

        <div>
          <label htmlFor="filtrePriorite">
            Priorité
          </label>

          <select
            id="filtrePriorite"
            value={filtrePriorite}
            onChange={(event) =>
              setFiltrePriorite(event.target.value)
            }
          >
            <option value="">
              Toutes les priorités
            </option>
            <option value="basse">
              Basse
            </option>
            <option value="moyenne">
              Moyenne
            </option>
            <option value="haute">
              Haute
            </option>
          </select>
        </div>

        <button
          type="button"
          onClick={() => {
            setRecherche('')
            setFiltreStatut('')
            setFiltrePriorite('')
          }}
        >
          Réinitialiser les filtres
        </button>
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

        {/* {taches.length === 0 ? (
          <p>Aucune tâche pour ce projet.</p>
        ) : (
          <div>
            {taches.map((tache) => ( */}

        {tachesFiltrees.length === 0 ? (
          <p>
            Aucune tâche ne correspond aux critères.
          </p>
        ) : (
          <div>
            {tachesFiltrees.map((tache) => (

              <article key={tache.id}>
                <h3>{tache.titre}</h3>

                <p>{tache.description}</p>

                {/* <p>
                  <strong>Statut :</strong>{' '}
                  {tache.statut}
                </p> */}


                <div>
                  <label htmlFor={`statut-${tache.id}`}>
                    <strong>Statut :</strong>
                  </label>{' '}

                  <select
                    id={`statut-${tache.id}`}
                    value={tache.statut}
                    onChange={(event) =>
                      gererChangementStatut(
                        tache,
                        event.target.value,
                      )
                    }
                  >
                    <option value="a_faire">
                      À faire
                    </option>

                    <option value="en_cours">
                      En cours
                    </option>

                    <option value="terminee">
                      Terminée
                    </option>
                  </select>
                </div>


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

                <button
                  type="button"
                  onClick={() => gererSuppressionTache(tache)}
                >
                  Supprimer
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