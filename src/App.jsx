import { useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import './App.css'
import HomePage from './pages/HomePage'
import PokeInfo from './pages/PokeInfo'
import Pokedex from './pages/Pokedex'
import PokeLoader from './components/shared/PokeLoader'

function App() {
  const [visible, setVisible] = useState(false)

  return (
    <div>
      <PokeLoader
        onOpen={() => requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)))}
      />
      <div className={`app-content ${visible ? 'app-content--visible' : ''}`}>
        <Routes>
          <Route path='/' element={<HomePage/>}/>
          <Route>
            <Route path='pokedex' element={<Pokedex/>}/>
            <Route path='pokedex/:id' element={<PokeInfo/>}/>
          </Route>
        </Routes>
      </div>
    </div>
  )
}

export default App;