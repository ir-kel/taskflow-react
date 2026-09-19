import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
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

  // prochaines échéances

  const maintenant = new Date()

  const annee = maintenant.getFullYear()
  const mois = String(
    maintenant.getMonth() + 1,
  ).padStart(2, '0')
  const jour = String(
    maintenant.getDate(),
  ).padStart(2, '0')

  const dateAujourdHui = `${annee}-${mois}-${jour}`

  const prochainesEcheances = taches
    .filter(
      (tache) =>
        tache.echeance &&
        tache.statut !== 'terminee' &&
        tache.echeance >= dateAujourdHui,
    )
    .sort((a, b) =>
      a.echeance.localeCompare(b.echeance),
    )
    .slice(0, 5)

  const tachesEnRetard = taches
    .filter(
      (tache) =>
        tache.echeance &&
        tache.statut !== 'terminee' &&
        tache.echeance < dateAujourdHui,
    )
    .sort((a, b) =>
      a.echeance.localeCompare(b.echeance),
    )

    const tachesRecentes = taches
    .filter((tache) => tache.creeLe)
    .sort((a, b) =>
      b.creeLe.localeCompare(a.creeLe),
    )
    .slice(0, 5)

    const formaterDate = (dateIso) => {
      if (!dateIso) {
        return 'Aucune échéance'
      }

      const [annee, mois, jour] = dateIso.split('-')

      return `${jour}/${mois}/${annee}`
    }

    const calculerJoursRetard = (echeance) => {
      const [anneeEcheance, moisEcheance, jourEcheance] =
        echeance.split('-').map(Number)

      const [anneeAujourdhui, moisAujourdhui, jourAujourdhui] =
        dateAujourdHui.split('-').map(Number)

      const dateEcheanceUtc = Date.UTC(
        anneeEcheance,
        moisEcheance - 1,
        jourEcheance,
      )

      const dateAujourdhuiUtc = Date.UTC(
        anneeAujourdhui,
        moisAujourdhui - 1,
        jourAujourdhui,
      )

      const millisecondesParJour =
        1000 * 60 * 60 * 24

      return Math.floor(
        (dateAujourdhuiUtc - dateEcheanceUtc) /
          millisecondesParJour,
      )
    }

    return (
      <main className="dashboard-page">
        <header className="dashboard-header">
          <div>
            <h1>Tableau de bord</h1>

            <p>
              Bienvenue {utilisateur.nom}.
            </p>
          </div>
        </header>

        <section className="dashboard-section">
          <h2>Statistiques</h2>

          <div className="dashboard-stats-grid">
            <article className="dashboard-stat-card">
              <h3>Projets</h3>
              <p>{totalProjets}</p>
            </article>

            <article className="dashboard-stat-card">
              <h3>Tâches</h3>
              <p>{totalTaches}</p>
            </article>

            <article className="dashboard-stat-card">
              <h3>À faire</h3>
              <p>{tachesAFaire}</p>
            </article>

            <article className="dashboard-stat-card">
              <h3>En cours</h3>
              <p>{tachesEnCours}</p>
            </article>

            <article className="dashboard-stat-card">
              <h3>Terminées</h3>
              <p>{tachesTerminees}</p>
            </article>

            <article className="dashboard-stat-card">
              <h3>En retard</h3>
              <p>{tachesEnRetard.length}</p>
            </article>
          </div>
        </section>

      <section className="dashboard-section">
        <h2>Progression globale</h2>

        <p>{progression} %</p>

        <progress
          value={progression}
          max="100"
        >
          {progression} %
        </progress>
      </section>

      <section className="dashboard-section">
        <h2>Progression par projet</h2>

        {projetsAvecProgression.length === 0 ? (
          <p>Aucun projet pour le moment.</p>
        ) : (
          <div>
            {projetsAvecProgression.map((projet) => (
              <article key={projet.id}>
              
                <h3>
                  <Link to={`/projets/${projet.id}`}>
                    {projet.nom}
                  </Link>
                </h3>

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

      <section className="dashboard-section">
        <h2>Prochaines échéances</h2>

        {prochainesEcheances.length === 0 ? (
          <p>
            Aucune échéance à venir.
          </p>
        ) : (
          <div>
            {prochainesEcheances.map((tache) => {
              const projetTache = projets.find(
                (projet) =>
                  projet.id === tache.projetId,
              )

         
              return (
                <article key={tache.id}>
               
                  <h3>
                    <Link to={`/projets/${tache.projetId}`}>
                      {tache.titre}
                    </Link>
                  </h3>

                  <p>
                    <strong>Projet :</strong>{' '}
                    {projetTache?.nom ??
                      'Projet inconnu'}
                  </p>

               

                  <p>
                    <strong>Échéance :</strong>{' '}
                    {formaterDate(tache.echeance)}
                  </p>

          

                

                  <p>
                    <strong>Priorité :</strong>{' '}
                    {tache.priorite}
                  </p>

                  <p>
                    <strong>Statut :</strong>{' '}
                    {tache.statut}
                  </p>
                </article>
              )
            })}
          </div>
        )}
      </section>

      <section className="dashboard-section">
        <h2>Tâches en retard</h2>

        {tachesEnRetard.length === 0 ? (
          <p>Aucune tâche en retard.</p>
        ) : (
          <div>
            {tachesEnRetard.map((tache) => {
              const projetTache = projets.find(
                (projet) =>
                  projet.id === tache.projetId,
              )

              const joursRetard =
                calculerJoursRetard(tache.echeance)

              return (
                <article key={tache.id}>
                 
                  <h3>
                    <Link to={`/projets/${tache.projetId}`}>
                      {tache.titre}
                    </Link>
                  </h3>

                  <p>
                    <strong>Projet :</strong>{' '}
                    {projetTache?.nom ??
                      'Projet inconnu'}
                  </p>

                  <p>
                    <strong>Échéance :</strong>{' '}
                   
                    {formaterDate(tache.echeance)}
                  </p>

                  <p>
                    <strong>Retard :</strong>{' '}
                    {joursRetard}{' '}
                    {joursRetard === 1
                      ? 'jour'
                      : 'jours'}
                  </p>

                  <p>
                    <strong>Priorité :</strong>{' '}
                    {tache.priorite}
                  </p>

                  <p>
                    <strong>Statut :</strong>{' '}
                    {tache.statut}
                  </p>
                </article>
              )
            })}
          </div>
        )}
      </section>

      <section className="dashboard-section">
        <h2>Tâches récentes</h2>

        {tachesRecentes.length === 0 ? (
          <p>Aucune tâche récente.</p>
        ) : (
          <div>
            {tachesRecentes.map((tache) => {
              const projetTache = projets.find(
                (projet) =>
                  projet.id === tache.projetId,
              )

              return (
                <article key={tache.id}>
               
                  <h3>
                    <Link to={`/projets/${tache.projetId}`}>
                      {tache.titre}
                    </Link>
                  </h3>

                  <p>
                    <strong>Projet :</strong>{' '}
                    {projetTache?.nom ??
                      'Projet inconnu'}
                  </p>

                  <p>
                    <strong>Créée le :</strong>{' '}
                    {formaterDate(tache.creeLe)}
                  </p>

                  <p>
                    <strong>Priorité :</strong>{' '}
                    {tache.priorite}
                  </p>

                  <p>
                    <strong>Statut :</strong>{' '}
                    {tache.statut}
                  </p>
                </article>
              )
            })}
          </div>
        )}
      </section>

    </main>
  )
}

export default Dashboard