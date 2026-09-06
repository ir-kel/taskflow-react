import { Outlet } from 'react-router-dom'
import BarreLaterale from './BarreLaterale.jsx'

function MiseEnPage() {
  return (
    <div className="app-layout">
      <BarreLaterale />

      <div className="app-content">
        <Outlet />
      </div>
    </div>
  )
}

export default MiseEnPage