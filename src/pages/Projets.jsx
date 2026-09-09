import { useEffect, useState } from 'react'
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

              <button
                type="button"
                onClick={() => setProjetEnEdition(projet)}
              >
                Modifier
              </button>
            </article>
          ))}
        </div>
      )}
    </main>
  )
  
}

export default Projets