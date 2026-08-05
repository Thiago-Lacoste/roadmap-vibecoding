import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { RoadmapProvider } from './context/RoadmapContext'
import Home from './pages/Home'
import Editor from './pages/Editor'

function AndonLamp() {
  const location = useLocation()
  const enTopbar = location.pathname.startsWith('/editor')

  return (
    <img
      src="/images/andon.png"
      alt=""
      className={`andon-image${enTopbar ? ' andon-en-topbar' : ''}`}
      aria-hidden="true"
    />
  )
}

function App() {
  return (
    <RoadmapProvider>
      <BrowserRouter>
        <AndonLamp />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/editor/:id" element={<Editor />} />
        </Routes>
      </BrowserRouter>
    </RoadmapProvider>
  )
}

export default App
