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
      <main className="page-state">
        <div className="page-state-card">
          <div
            className="page-state-loader"
            aria-hidden="true"
          />

          <h2>Chargement du tableau de bord</h2>

          <p>
            Récupération de vos projets et de vos tâches...
          </p>
        </div>
      </main>
    )
  }

  if (erreur) {
    return (
      <main className="page-state">
        <div className="page-state-card page-state-error">
          <h2>Impossible de charger le tableau de bord</h2>

          <p>{erreur}</p>
        </div>
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

        <div className="dashboard-progress-card">
          <div className="dashboard-progress-header">
            <span>Avancement général </span>
            <strong>{progression} %</strong>
          </div>

          <div className="dashboard-progress-track">
            <div
              className="dashboard-progress-bar"
              style={{
                width: `${progression}%`,
              }}
            />
          </div>

          <p className="dashboard-progress-detail">
            {tachesTerminees} tâche
            {tachesTerminees > 1 ? 's' : ''} terminée
            {tachesTerminees > 1 ? 's' : ''} sur{' '}
            {totalTaches}
          </p>
        </div>
      </section>

      <section className="dashboard-section">
        <h2>Progression par projet</h2>

        {projetsAvecProgression.length === 0 ? (
          <p>Aucun projet pour le moment.</p>
        ) : (
          <div className="dashboard-project-progress-grid">
            {projetsAvecProgression.map((projet) => (
              
              <article
                key={projet.id}
                className="dashboard-project-progress-card"
              >
                <div className="dashboard-progress-header">
                  <h3>
                    <Link to={`/projets/${projet.id}`}>
                      {projet.nom}
                    </Link>
                  </h3>

                  <strong>
                    {projet.progression} %
                  </strong>
                </div>

                <div className="dashboard-progress-track">
                  <div
                    className="dashboard-progress-bar"
                    style={{
                      width: `${projet.progression}%`,
                    }}
                  />
                </div>

                <p className="dashboard-progress-detail">
                  {projet.tachesTerminees} /{' '}
                  {projet.totalTaches} tâches terminées
                </p>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="dashboard-section">
        <h2>Prochaines échéances</h2>

        {prochainesEcheances.length === 0 ? (
          <p className="dashboard-empty-state">
            Aucune échéance à venir.
          </p>
        ) : (
          <div className="dashboard-task-grid">
            {prochainesEcheances.map((tache) => {
              const projetTache = projets.find(
                (projet) =>
                  projet.id === tache.projetId,
              )

         
              return (
                <article
                  key={tache.id}
                  className="dashboard-task-card"
                >
               
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

                    <span
                      className={`dashboard-badge dashboard-priority-${tache.priorite}`}
                    >
                      {tache.priorite}
                    </span>
                  </p>

                  <p>
                    <strong>Statut :</strong>{' '}

                    <span
                      className={`dashboard-badge dashboard-status-${tache.statut}`}
                    >
                      {tache.statut}
                    </span>
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
          <p className="dashboard-empty-state">Aucune tâche en retard.</p>
        ) : (
          <div className="dashboard-task-grid">
            {tachesEnRetard.map((tache) => {
              const projetTache = projets.find(
                (projet) =>
                  projet.id === tache.projetId,
              )

              const joursRetard =
                calculerJoursRetard(tache.echeance)

              return (
                <article
                  key={tache.id}
                  className="dashboard-task-card dashboard-task-card-overdue"
                >
                 
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

                
                  <p className="dashboard-overdue-text">
                    <strong>Retard :</strong>{' '}
                    {joursRetard}{' '}
                    {joursRetard === 1
                      ? 'jour'
                      : 'jours'}
                  </p>

                  <p>
                    <strong>Priorité :</strong>{' '}

                    <span
                      className={`dashboard-badge dashboard-priority-${tache.priorite}`}
                    >
                      {tache.priorite}
                    </span>
                  </p>

                  <p>
                    <strong>Statut :</strong>{' '}

                    <span
                      className={`dashboard-badge dashboard-status-${tache.statut}`}
                    >
                      {tache.statut}
                    </span>
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
          <p className="dashboard-empty-state">Aucune tâche récente.</p>
        ) : (
          <div className="dashboard-task-grid">
            {tachesRecentes.map((tache) => {
              const projetTache = projets.find(
                (projet) =>
                  projet.id === tache.projetId,
              )

              return (
                <article
                  key={tache.id}
                  className="dashboard-task-card"
                >
                              
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

                    <span
                      className={`dashboard-badge dashboard-priority-${tache.priorite}`}
                    >
                      {tache.priorite}
                    </span>
                  </p>

                  <p>
                    <strong>Statut :</strong>{' '}

                    <span
                      className={`dashboard-badge dashboard-status-${tache.statut}`}
                    >
                      {tache.statut}
                    </span>
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