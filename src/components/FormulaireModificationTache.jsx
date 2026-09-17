import { useState } from 'react'

function FormulaireModificationTache({
  tache,
  onTacheModifiee,
  onAnnuler,
}) {
  const [titre, setTitre] = useState(tache.titre)
  const [description, setDescription] = useState(
    tache.description ?? '',
  )
  const [statut, setStatut] = useState(tache.statut)
  const [priorite, setPriorite] = useState(
    tache.priorite,
  )
  const [echeance, setEcheance] = useState(
    tache.echeance ?? '',
  )
  const [erreur, setErreur] = useState('')
  const [envoi, setEnvoi] = useState(false)

  const gererSoumission = async (event) => {
    event.preventDefault()

    const titreNettoye = titre.trim()
    const descriptionNettoyee =
      description.trim()

    if (!titreNettoye) {
      setErreur(
        'Le titre de la tâche est obligatoire.',
      )
      return
    }

    setErreur('')
    setEnvoi(true)

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
            titre: titreNettoye,
            description: descriptionNettoyee,
            statut,
            priorite,
            echeance,
            modifieLe: dateModification,
          }),
        },
      )

      if (!reponse.ok) {
        throw new Error(
          'Erreur lors de la modification de la tâche',
        )
      }

      const tacheModifiee =
        await reponse.json()

      onTacheModifiee(tacheModifiee)
    } catch (error) {
      console.error(error)
      setErreur(
        'Impossible de modifier la tâche.',
      )
    } finally {
      setEnvoi(false)
    }
  }

  return (
    <section>
      <h2>Modifier la tâche</h2>

      <form onSubmit={gererSoumission}>
        <div>
          <label htmlFor="titreTacheModification">
            Titre
          </label>

          <input
            id="titreTacheModification"
            type="text"
            value={titre}
            onChange={(event) =>
              setTitre(event.target.value)
            }
            required
          />
        </div>

        <div>
          <label htmlFor="descriptionTacheModification">
            Description
          </label>

          <textarea
            id="descriptionTacheModification"
            value={description}
            onChange={(event) =>
              setDescription(event.target.value)
            }
          />
        </div>

        <div>
          <label htmlFor="statutTacheModification">
            Statut
          </label>

          <select
            id="statutTacheModification"
            value={statut}
            onChange={(event) =>
              setStatut(event.target.value)
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

        <div>
          <label htmlFor="prioriteTacheModification">
            Priorité
          </label>

          <select
            id="prioriteTacheModification"
            value={priorite}
            onChange={(event) =>
              setPriorite(event.target.value)
            }
          >
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

        <div>
          <label htmlFor="echeanceTacheModification">
            Échéance
          </label>

          <input
            id="echeanceTacheModification"
            type="date"
            value={echeance}
            onChange={(event) =>
              setEcheance(event.target.value)
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

export default FormulaireModificationTache