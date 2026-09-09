import { useState } from 'react'

function FormulaireModificationProjet({
  projet,
  onProjetModifie,
  onAnnuler,
}) {
  const [nom, setNom] = useState(projet.nom)
  const [description, setDescription] = useState(
    projet.description,
  )
  const [couleur, setCouleur] = useState(projet.couleur)
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
      const reponse = await fetch(
        `http://localhost:3000/projets/${projet.id}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            nom: nomNettoye,
            description: descriptionNettoyee,
            couleur,
          }),
        },
      )

      if (!reponse.ok) {
        throw new Error(
          'Erreur lors de la modification du projet',
        )
      }

      const projetModifie = await reponse.json()

      onProjetModifie(projetModifie)
    } catch (error) {
      console.error(error)
      setErreur('Impossible de modifier le projet.')
    } finally {
      setEnvoi(false)
    }
  }

  return (
    <section>
      <h2>Modifier le projet</h2>

      <form onSubmit={gererSoumission}>
        <div>
          <label htmlFor="nomProjetModification">
            Nom du projet
          </label>

          <input
            id="nomProjetModification"
            type="text"
            value={nom}
            onChange={(event) =>
              setNom(event.target.value)
            }
            required
          />
        </div>

        <div>
          <label htmlFor="descriptionProjetModification">
            Description
          </label>

          <textarea
            id="descriptionProjetModification"
            value={description}
            onChange={(event) =>
              setDescription(event.target.value)
            }
          />
        </div>

        <div>
          <label htmlFor="couleurProjetModification">
            Couleur
          </label>

          <input
            id="couleurProjetModification"
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
            ? 'Modification...'
            : 'Enregistrer les modifications'}
        </button>

        <button
          type="button"
          onClick={onAnnuler}
          disabled={envoi}
        >
          Annuler
        </button>
      </form>
    </section>
  )
}

export default FormulaireModificationProjet