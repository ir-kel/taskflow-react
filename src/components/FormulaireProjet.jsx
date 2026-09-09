import { useState } from 'react'

function FormulaireProjet({
  utilisateurId,
  onProjetCree,
}) {
  const [nom, setNom] = useState('')
  const [description, setDescription] = useState('')
  const [couleur, setCouleur] = useState('#4F46E5')
  const [erreur, setErreur] = useState('')
  const [envoi, setEnvoi] = useState(false)

  const gererSoumission = async (event) => {
    event.preventDefault()

    const nomNettoye = nom.trim()
    const descriptionNettoyee = description.trim()

    if (!nomNettoye) {
      setErreur('Le nom du projet est obligatoire.')
      return
    }

    setErreur('')
    setEnvoi(true)

    try {
      const nouveauProjet = {
        utilisateurId,
        nom: nomNettoye,
        description: descriptionNettoyee,
        couleur,
        creeLe: new Date().toISOString().slice(0, 10),
      }

      const reponse = await fetch(
        'http://localhost:3000/projets',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(nouveauProjet),
        },
      )

      if (!reponse.ok) {
        throw new Error(
          'Erreur lors de la création du projet',
        )
      }

      const projetCree = await reponse.json()

      onProjetCree(projetCree)

      setNom('')
      setDescription('')
      setCouleur('#4F46E5')
    } catch (error) {
      console.error(error)
      setErreur('Impossible de créer le projet.')
    } finally {
      setEnvoi(false)
    }
  }

  return (
    <section>
      <h2>Nouveau projet</h2>

      <form onSubmit={gererSoumission}>
        <div>
          <label htmlFor="nomProjet">
            Nom du projet
          </label>

          <input
            id="nomProjet"
            type="text"
            value={nom}
            onChange={(event) =>
              setNom(event.target.value)
            }
            required
          />
        </div>

        <div>
          <label htmlFor="descriptionProjet">
            Description
          </label>

          <textarea
            id="descriptionProjet"
            value={description}
            onChange={(event) =>
              setDescription(event.target.value)
            }
          />
        </div>

        <div>
          <label htmlFor="couleurProjet">
            Couleur
          </label>

          <input
            id="couleurProjet"
            type="color"
            value={couleur}
            onChange={(event) =>
              setCouleur(event.target.value)
            }
          />
        </div>

        {erreur && <p>{erreur}</p>}

        <button
          type="submit"
          disabled={envoi}
        >
          {envoi
            ? 'Création...'
            : 'Créer le projet'}
        </button>
      </form>
    </section>
  )
}

export default FormulaireProjet