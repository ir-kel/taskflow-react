import { useEffect, useState } from 'react'
import useAuth from '../hooks/useAuth.js'

function Dashboard() {
  const { utilisateur } = useAuth()

  const [projets, setProjets] = useState([])
  const [taches, setTaches] = useState([])
  const [chargement, setChargement] = useState(true)
  const [erreur, setErreur] = useState('')

  useEffect(() => {
    const chargerDashboard = async () => {
      try {
        setChargement(true)
        setErreur('')

        const reponseProjets = await fetch(
          `http://localhost:3000/projets?utilisateurId=${utilisateur.id}`,
        )

        if (!reponseProjets.ok) {
          throw new Error(
            'Erreur lors du chargement des projets',
          )
        }

        const donneesProjets =
          await reponseProjets.json()

        setProjets(donneesProjets)

        const requetesTaches = donneesProjets.map(
          (projet) =>
            fetch(
              `http://localhost:3000/taches?projetId=${projet.id}`,
            ).then((reponse) => {
              if (!reponse.ok) {
                throw new Error(
                  'Erreur lors du chargement des tâches',
                )
              }

              return reponse.json()
            }),
        )

        const groupesTaches =
          await Promise.all(requetesTaches)

        const toutesLesTaches =
          groupesTaches.flat()

        setTaches(toutesLesTaches)
      } catch (error) {
        console.error(error)

        setErreur(
          'Impossible de charger le tableau de bord.',
        )
      } finally {
        setChargement(false)
      }
    }

    chargerDashboard()
  }, [utilisateur.id])

  if (chargement) {
    return (
      <main>
        <h1>Tableau de bord</h1>
        <p>Chargement des statistiques...</p>
      </main>
    )
  }

  if (erreur) {
    return (
      <main>
        <h1>Tableau de bord</h1>
        <p>{erreur}</p>
      </main>
    )
  }

  const totalProjets = projets.length
  const totalTaches = taches.length

  const tachesAFaire = taches.filter(
    (tache) => tache.statut === 'a_faire',
  ).length

  const tachesEnCours = taches.filter(
    (tache) => tache.statut === 'en_cours',
  ).length

  const tachesTerminees = taches.filter(
    (tache) => tache.statut === 'terminee',
  ).length

  const progression =
    totalTaches === 0
      ? 0
      : Math.round(
          (tachesTerminees / totalTaches) * 100,
        )

  const projetsAvecProgression = projets.map((projet) => {
    const tachesProjet = taches.filter(
      (tache) => tache.projetId === projet.id,
    )

    const totalTachesProjet = tachesProjet.length

    const tachesTermineesProjet = tachesProjet.filter(
      (tache) => tache.statut === 'terminee',
    ).length

    const progressionProjet =
      totalTachesProjet === 0
        ? 0
        : Math.round(
            (
              tachesTermineesProjet /
              totalTachesProjet
            ) * 100,
          )

    return {
      ...projet,
      totalTaches: totalTachesProjet,
      tachesTerminees: tachesTermineesProjet,
      progression: progressionProjet,
    }
  })

  return (
    <main>
      <h1>Tableau de bord</h1>

      <p>
        Bienvenue {utilisateur.nom}.
      </p>

      <section>
        <h2>Statistiques</h2>

        <div>
          <article>
            <h3>Projets</h3>
            <p>{totalProjets}</p>
          </article>

          <article>
            <h3>Tâches</h3>
            <p>{totalTaches}</p>
          </article>

          <article>
            <h3>À faire</h3>
            <p>{tachesAFaire}</p>
          </article>

          <article>
            <h3>En cours</h3>
            <p>{tachesEnCours}</p>
          </article>

          <article>
            <h3>Terminées</h3>
            <p>{tachesTerminees}</p>
          </article>
        </div>
      </section>

      <section>
        <h2>Progression globale</h2>

        <p>{progression} %</p>

        <progress
          value={progression}
          max="100"
        >
          {progression} %
        </progress>
      </section>

      <section>
        <h2>Progression par projet</h2>

        {projetsAvecProgression.length === 0 ? (
          <p>Aucun projet pour le moment.</p>
        ) : (
          <div>
            {projetsAvecProgression.map((projet) => (
              <article key={projet.id}>
                <h3>{projet.nom}</h3>

                <p>
                  {projet.tachesTerminees} /{' '}
                  {projet.totalTaches} tâches terminées
                </p>

                <p>
                  {projet.progression} %
                </p>

                <progress
                  value={projet.progression}
                  max="100"
                >
                  {projet.progression} %
                </progress>
              </article>
            ))}
          </div>
        )}
      </section>

    </main>
  )
}

export default Dashboard