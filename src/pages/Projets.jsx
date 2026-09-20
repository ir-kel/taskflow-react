import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import useAuth from '../hooks/useAuth.js'
import FormulaireProjet from '../components/FormulaireProjet.jsx'
import FormulaireModificationProjet
  from '../components/FormulaireModificationProjet.jsx'



function Projets() {
  const { utilisateur } = useAuth()

  const [projets, setProjets] = useState([])
  const [projetEnEdition, setProjetEnEdition] =
  useState(null)
  const [chargement, setChargement] = useState(true)
  const [erreur, setErreur] = useState('')
  
  const gererProjetCree = (projetCree) => {
    setProjets((projetsActuels) => [
      ...projetsActuels,
      projetCree,
    ])
  }

  const gererProjetModifie = (projetModifie) => {
    setProjets((projetsActuels) =>
      projetsActuels.map((projet) =>
        projet.id === projetModifie.id
          ? projetModifie
          : projet,
      ),
    )

    setProjetEnEdition(null)
  }

  useEffect(() => {
    const chargerProjets = async () => {
      try {
        setChargement(true)
        setErreur('')

        const reponse = await fetch(
          `http://localhost:3000/projets?utilisateurId=${utilisateur.id}`,
        )

        if (!reponse.ok) {
          throw new Error('Erreur lors du chargement des projets')
        }

        const donnees = await reponse.json()

        setProjets(donnees)
      } catch (error) {
        console.error(error)
        setErreur('Impossible de charger les projets.')
      } finally {
        setChargement(false)
      }
    }

    chargerProjets()
  }, [utilisateur.id])

  if (chargement) {
    return (
      <main className="projects-page">
        <header className="projects-header">
          <div>
            <h1>Mes projets</h1>
            <p>
              Créez et gérez vos différents projets.
            </p>
          </div>
        </header>
        <p>Chargement des projets...</p>
      </main>
    )
  }

  if (erreur) {
    return (
      <main>
        <h1>Mes projets</h1>
        <p>{erreur}</p>
      </main>
    )
  }

  const gererSuppressionProjet = async (projet) => {
    const confirmation = window.confirm(
      `Voulez-vous vraiment supprimer le projet "${projet.nom}" ?`,
    )

    if (!confirmation) {
      return
    }

    try {
      const reponse = await fetch(
        `http://localhost:3000/projets/${projet.id}`,
        {
          method: 'DELETE',
        },
      )

      if (!reponse.ok) {
        throw new Error(
          'Erreur lors de la suppression du projet',
        )
      }

      setProjets((projetsActuels) =>
        projetsActuels.filter(
          (projetActuel) =>
            projetActuel.id !== projet.id,
        ),
      )

      if (projetEnEdition?.id === projet.id) {
        setProjetEnEdition(null)
      }
    } catch (error) {
      console.error(error)
      setErreur('Impossible de supprimer le projet.')
    }
  }

  return (
   
    <main>
      <h1>Mes projets</h1>

      <div className="projects-form-wrapper">
        <FormulaireProjet
          utilisateurId={utilisateur.id}
          onProjetCree={gererProjetCree}
        />
      </div>

      {projetEnEdition && (
        <FormulaireModificationProjet
          key={projetEnEdition.id}
          projet={projetEnEdition}
          onProjetModifie={gererProjetModifie}
          onAnnuler={() => setProjetEnEdition(null)}
        />
      )}

      {projets.length === 0 ? (
        <div className="projects-empty-state">
          <h2>Aucun projet</h2>
          <p>
            Commencez par créer votre premier projet.
          </p>
        </div>
      ) : (
        <div className="projects-grid">
          {projets.map((projet) => (
            <article
              key={projet.id}
              className="project-card"
              style={{
                borderTopColor: projet.couleur,
              }}
            >
              <h2>{projet.nom}</h2>
              <p>{projet.description}</p>

              <Link to={`/projets/${projet.id}`}>
                Voir le projet
              </Link>

              <div className="project-card-actions">
                <Link
                  to={`/projets/${projet.id}`}
                  className="button button-primary"
                >
                  Voir
                </Link>

                <button
                  type="button"
                  className="button button-secondary"
                  onClick={() => setProjetEnEdition(projet)}
                >
                  Modifier
                </button>

                <button
                  type="button"
                  className="button button-danger"
                  onClick={() => gererSuppressionProjet(projet)}
                >
                  Supprimer
                </button>
              </div>

            </article>
          ))}
        </div>
      )}
    </main>
  )
  
}

export default Projets