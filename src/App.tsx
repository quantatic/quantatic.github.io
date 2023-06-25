import './App.css'
import Gb from './Gb';

import Gba from './Gba'
import Homepage from './Homepage';

import { HashRouter, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/gb" element={<Gb />} />
        <Route path="/gba" element={<Gba />} />
      </Routes>
    </HashRouter>
  )
}

export default App
