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
      <main>
        <h1>Mes projets</h1>
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

      <FormulaireProjet
        utilisateurId={utilisateur.id}
        onProjetCree={gererProjetCree}
      />

      {projetEnEdition && (
        <FormulaireModificationProjet
          key={projetEnEdition.id}
          projet={projetEnEdition}
          onProjetModifie={gererProjetModifie}
          onAnnuler={() => setProjetEnEdition(null)}
        />
      )}

      {projets.length === 0 ? (
        <p>Aucun projet pour le moment.</p>
      ) : (
        <div>
          {projets.map((projet) => (
            <article key={projet.id}>
              <h2>{projet.nom}</h2>
              <p>{projet.description}</p>

              <Link to={`/projets/${projet.id}`}>
                Voir le projet
              </Link>

              <button
                type="button"
                onClick={() => setProjetEnEdition(projet)}
              >
                Modifier
              </button>

              <button
                type="button"
                onClick={() => gererSuppressionProjet(projet)}
              >
                Supprimer
              </button>

            </article>
          ))}
        </div>
      )}
    </main>
  )
  
}

export default Projets