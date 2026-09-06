import { Navigate, Route, Routes } from 'react-router-dom'
import MiseEnPage from './components/MiseEnPage.jsx'
import Connexion from './pages/Connexion.jsx'
import Inscription from './pages/Inscription.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Projets from './pages/Projets.jsx'
import DetailProjet from './pages/DetailProjet.jsx'
import NonTrouve from './pages/NonTrouve.jsx'

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={<Navigate to="/connexion" replace />}
      />

      <Route
        path="/connexion"
        element={<Connexion />}
      />

      <Route
        path="/inscription"
        element={<Inscription />}
      />

      <Route element={<MiseEnPage />}>
        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

        <Route
          path="/projets"
          element={<Projets />}
        />

        <Route
          path="/projets/:id"
          element={<DetailProjet />}
        />
      </Route>

      <Route
        path="*"
        element={<NonTrouve />}
      />
    </Routes>
  )
}

export default App