import { useState } from 'react'

function FormulaireTache({
  projetId,
  onTacheCreee,
}) {
  const [titre, setTitre] = useState('')
  const [description, setDescription] = useState('')
  const [statut, setStatut] = useState('a_faire')
  const [priorite, setPriorite] = useState('moyenne')
  const [echeance, setEcheance] = useState('')
  const [erreur, setErreur] = useState('')
  const [envoi, setEnvoi] = useState(false)

  const gererSoumission = async (event) => {
    event.preventDefault()

    const titreNettoye = titre.trim()
    const descriptionNettoyee = description.trim()

    if (!titreNettoye) {
      setErreur('Le titre de la tâche est obligatoire.')
      return
    }

    setErreur('')
    setEnvoi(true)

    const dateActuelle = new Date()
      .toISOString()
      .slice(0, 10)

    const nouvelleTache = {
      projetId: Number(projetId),
      titre: titreNettoye,
      description: descriptionNettoyee,
      statut,
      priorite,
      echeance,
      creeLe: dateActuelle,
      modifieLe: dateActuelle,
    }

    try {
      const reponse = await fetch(
        'http://localhost:3000/taches',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(nouvelleTache),
        },
      )

      if (!reponse.ok) {
        throw new Error(
          'Erreur lors de la création de la tâche',
        )
      }

      const tacheCreee = await reponse.json()

      onTacheCreee(tacheCreee)

      setTitre('')
      setDescription('')
      setStatut('a_faire')
      setPriorite('moyenne')
      setEcheance('')
    } catch (error) {
      console.error(error)
      setErreur('Impossible de créer la tâche.')
    } finally {
      setEnvoi(false)
    }
  }

  return (
    <section>
      <h2>Nouvelle tâche</h2>

      <form onSubmit={gererSoumission}>
        <div>
          <label htmlFor="titreTache">
            Titre
          </label>

          <input
            id="titreTache"
            type="text"
            value={titre}
            onChange={(event) =>
              setTitre(event.target.value)
            }
            required
          />
        </div>

        <div>
          <label htmlFor="descriptionTache">
            Description
          </label>

          <textarea
            id="descriptionTache"
            value={description}
            onChange={(event) =>
              setDescription(event.target.value)
            }
          />
        </div>

        <div>
          <label htmlFor="statutTache">
            Statut
          </label>

          <select
            id="statutTache"
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
          <label htmlFor="prioriteTache">
            Priorité
          </label>

          <select
            id="prioriteTache"
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
          <label htmlFor="echeanceTache">
            Échéance
          </label>

          <input
            id="echeanceTache"
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
            ? 'Création...'
            : 'Créer la tâche'}
        </button>
      </form>
    </section>
  )
}

export default FormulaireTache