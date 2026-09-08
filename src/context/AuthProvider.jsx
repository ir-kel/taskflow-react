import { useState } from 'react'
import AuthContext from './AuthContext.js'

function AuthProvider({ children }) {
  const [utilisateur, setUtilisateur] = useState(() => {
    const utilisateurStocke = localStorage.getItem('taskflow_utilisateur')

    if (!utilisateurStocke) {
      return null
    }

    return JSON.parse(utilisateurStocke)
  })

//   const connecter = (nouvelUtilisateur) => {
//     setUtilisateur(nouvelUtilisateur)

//     localStorage.setItem(
//       'taskflow_utilisateur',
//       JSON.stringify(nouvelUtilisateur),
//     )
//   }

  const connecter = (nouvelUtilisateur) => {
  const utilisateurSession = {
        id: nouvelUtilisateur.id,
        nom: nouvelUtilisateur.nom,
        email: nouvelUtilisateur.email,
    }

    setUtilisateur(utilisateurSession)

    localStorage.setItem(
        'taskflow_utilisateur',
        JSON.stringify(utilisateurSession),
    )
    }

  const deconnecter = () => {
    setUtilisateur(null)
    localStorage.removeItem('taskflow_utilisateur')
  }

  return (
    <AuthContext.Provider
      value={{
        utilisateur,
        connecter,
        deconnecter,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider