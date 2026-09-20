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
    <main className="project-detail-page">
      <Link
        to="/projets"
        className="back-link"
      >
        ← Retour aux projets
      </Link>

      {/* =========================
          EN-TÊTE DU PROJET
          ========================= */}
      <header
        className="project-detail-header"
        style={{
          borderTopColor: projet.couleur,
        }}
      >
        <div>
          <p className="project-detail-label">
            Projet
          </p>

          <h1>{projet.nom}</h1>

          <p className="project-detail-description">
            {projet.description ||
              'Aucune description pour ce projet.'}
          </p>

          <div className="project-detail-meta">
            <p>
              <strong>Date de création :</strong>{' '}
              {projet.creeLe}
            </p>

            <div className="project-color-info">
              <strong>Couleur :</strong>

              <span
                className="project-color-swatch"
                style={{
                  backgroundColor: projet.couleur,
                }}
                aria-label={`Couleur du projet ${projet.couleur}`}
              />

              <span className="project-color-value">
                {projet.couleur}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* =========================
          CRÉATION D'UNE TÂCHE
          ========================= */}
      <section className="project-detail-section">
        <FormulaireTache
          projetId={id}
          onTacheCreee={gererTacheCreee}
        />
      </section>

      {/* =========================
          MODIFICATION D'UNE TÂCHE
          ========================= */}
      {tacheEnEdition && (
        <section className="project-detail-section">
          <FormulaireModificationTache
            key={tacheEnEdition.id}
            tache={tacheEnEdition}
            onTacheModifiee={gererTacheModifiee}
            onAnnuler={() =>
              setTacheEnEdition(null)
            }
          />
        </section>
      )}

      {/* =========================
          LISTE + FILTRES
          ========================= */}
      <section className="project-detail-section">
        <div className="tasks-section-header">
          <div>
            <h2>Tâches du projet</h2>

            <p>
              Recherchez et filtrez les tâches
              de ce projet.
            </p>
          </div>
        </div>

        <div className="task-filters">
          <div className="task-filter-search">
            <label htmlFor="rechercheTache">
              Rechercher une tâche
            </label>

            <input
              id="rechercheTache"
              className="form-control"
              type="search"
              placeholder="Titre ou description..."
              value={recherche}
              onChange={(event) =>
                setRecherche(event.target.value)
              }
            />
          </div>

          <div className="task-filter-item">
            <label htmlFor="filtreStatut">
              Statut
            </label>

            <select
              id="filtreStatut"
              className="form-control"
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

          <div className="task-filter-item">
            <label htmlFor="filtrePriorite">
              Priorité
            </label>

            <select
              id="filtrePriorite"
              className="form-control"
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

          <div className="task-filter-actions">
            <button
              type="button"
              className="button button-secondary"
              onClick={() => {
                setRecherche('')
                setFiltreStatut('')
                setFiltrePriorite('')
              }}
            >
              Réinitialiser
            </button>
          </div>
        </div>

        {/* =========================
            RÉSULTATS
            ========================= */}
        {tachesFiltrees.length === 0 ? (
          <div className="tasks-empty-state">
            <h3>Aucune tâche trouvée</h3>

            <p>
              Aucune tâche ne correspond
              aux critères actuels.
            </p>
          </div>
        ) : (
          <div className="tasks-grid">
            {tachesFiltrees.map((tache) => (
              <article
                key={tache.id}
                className={`task-card task-priority-${tache.priorite}`}
              >
                <div className="task-card-header">
                  <div>
                    <h3>{tache.titre}</h3>

                    <span
                      className={`task-priority-badge task-priority-badge-${tache.priorite}`}
                    >
                      {tache.priorite}
                    </span>
                  </div>
                </div>

                <p className="task-card-description">
                  {tache.description ||
                    'Aucune description.'}
                </p>

                <div className="task-status-control">
                  <label
                    htmlFor={`statut-${tache.id}`}
                  >
                    Statut
                  </label>

                  <select
                    id={`statut-${tache.id}`}
                    className="form-control"
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
                  <strong>Échéance :</strong>{' '}
                  {tache.echeance ||
                    'Aucune échéance'}
                </p>

                <div className="task-card-actions">
                  <button
                    type="button"
                    className="button button-secondary"
                    onClick={() =>
                      setTacheEnEdition(tache)
                    }
                  >
                    Modifier
                  </button>

                  <button
                    type="button"
                    className="button button-danger"
                    onClick={() =>
                      gererSuppressionTache(tache)
                    }
                  >
                    Supprimer
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}

export default DetailProjet